#!/usr/bin/env python3
"""Offline mechanical gate for sanitized outsourced Applied article MDX.

Usage:
    python outsource-content/check_sanitized.py <path-to-mdx-file>
    python outsource-content/check_sanitized.py --verbose <path-to-mdx-file>

The gate checks the Applied article build contract plus the vendor-specific
cleanup rules. It does not grade prose, fact-check claims, or make network
requests.
"""
import argparse
import ast
import csv
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass


ALLOWED_CATEGORIES = {
    "data-analysis",
    "experiments-causality",
    "time-series-forecasting",
    "machine-learning-statistics",
}
REQUIRED_FRONTMATTER = (
    "title", "description", "category", "primaryKeyword", "keywords",
    "phase", "draft",
)
VENDOR_HOSTS = {
    "babylovegrowth.ai",
    "www.babylovegrowth.ai",
    "babylovegrowth.com",
    "www.babylovegrowth.com",
}


class FrontmatterError(ValueError):
    """Raised when the repository's frontmatter YAML subset is malformed."""


def _strip_yaml_comment(value):
    quote = None
    escaped = False
    for index, char in enumerate(value):
        if escaped:
            escaped = False
            continue
        if char == "\\" and quote == '"':
            escaped = True
            continue
        if char in ("'", '"'):
            if quote is None:
                quote = char
            elif quote == char:
                quote = None
            continue
        if char == "#" and quote is None and (
            index == 0 or value[index - 1].isspace()
        ):
            return value[:index].rstrip()
    return value.rstrip()


def _parse_scalar(value, line_number):
    value = _strip_yaml_comment(value.strip())
    if not value:
        return ""
    if value.startswith("["):
        if not value.endswith("]"):
            raise FrontmatterError(
                f"line {line_number}: unterminated inline list"
            )
        try:
            parsed = ast.literal_eval(value)
        except (SyntaxError, ValueError):
            inner = value[1:-1].strip()
            if not inner:
                return []
            try:
                fields = next(csv.reader([inner], skipinitialspace=True))
            except csv.Error as exc:
                raise FrontmatterError(
                    f"line {line_number}: invalid inline list: {exc}"
                ) from None
            return [_parse_scalar(field, line_number) for field in fields]
        if not isinstance(parsed, (list, tuple)):
            raise FrontmatterError(f"line {line_number}: invalid inline list")
        return list(parsed)
    if value[0] in ("'", '"'):
        if len(value) < 2 or value[-1] != value[0]:
            raise FrontmatterError(f"line {line_number}: unterminated quoted value")
        try:
            return ast.literal_eval(value)
        except (SyntaxError, ValueError):
            raise FrontmatterError(
                f"line {line_number}: invalid quoted value"
            ) from None
    lowered = value.lower()
    if lowered == "true":
        return True
    if lowered == "false":
        return False
    if lowered in ("null", "~"):
        return None
    if re.fullmatch(r"[-+]?\d+", value):
        return int(value)
    if re.fullmatch(r"[-+]?(?:\d+\.\d*|\.\d+)(?:e[-+]?\d+)?", value, re.I):
        return float(value)
    return value


def _parse_frontmatter(frontmatter, first_line_number=2):
    """Parse the top-level scalar/list YAML forms used by this collection."""
    lines = frontmatter.splitlines()
    result = {}
    index = 0
    while index < len(lines):
        line = lines[index]
        line_number = first_line_number + index
        if not line.strip() or line.lstrip().startswith("#"):
            index += 1
            continue
        if line.startswith((" ", "\t")):
            raise FrontmatterError(f"line {line_number}: unexpected indentation")
        match = re.fullmatch(r"([A-Za-z_][A-Za-z0-9_-]*):(?:[ \t]*(.*))?", line)
        if not match:
            raise FrontmatterError(f"line {line_number}: expected 'key: value'")
        key, inline_value = match.group(1), match.group(2) or ""
        if key in result:
            raise FrontmatterError(f"line {line_number}: duplicate key '{key}'")

        child_start = index + 1
        child_end = child_start
        while child_end < len(lines):
            child = lines[child_end]
            if child.strip() and not child.startswith((" ", "\t")):
                break
            child_end += 1
        children = lines[child_start:child_end]
        meaningful_children = [
            child for child in children
            if child.strip() and not child.lstrip().startswith("#")
        ]

        if inline_value in ("|", ">"):
            if not meaningful_children:
                result[key] = ""
            else:
                indents = [len(child) - len(child.lstrip(" ")) for child in meaningful_children]
                if any(child.startswith("\t") for child in meaningful_children):
                    raise FrontmatterError(
                        f"line {line_number}: tabs cannot indent a block scalar"
                    )
                trim = min(indents)
                block_lines = [child[trim:] if child.strip() else "" for child in children]
                separator = "\n" if inline_value == "|" else " "
                result[key] = separator.join(block_lines).strip()
        elif inline_value:
            if meaningful_children:
                raise FrontmatterError(
                    f"line {line_number}: unexpected indented content"
                )
            result[key] = _parse_scalar(inline_value, line_number)
        elif meaningful_children:
            values = []
            for child_index, child in enumerate(children, start=child_start):
                if not child.strip() or child.lstrip().startswith("#"):
                    continue
                if child.startswith("\t"):
                    raise FrontmatterError(
                        f"line {first_line_number + child_index}: tabs cannot indent a list"
                    )
                item = re.fullmatch(r"[ ]+-[ ]+(.+)", child)
                if not item:
                    raise FrontmatterError(
                        f"line {first_line_number + child_index}: expected a list item"
                    )
                values.append(
                    _parse_scalar(item.group(1), first_line_number + child_index)
                )
            result[key] = values
        else:
            result[key] = None
        index = child_end
    return result


def _extract_frontmatter(text):
    lines = text.splitlines(keepends=True)
    if not lines or lines[0].strip() != "---":
        raise FrontmatterError("line 1: file must begin with '---'")
    end_index = None
    for index in range(1, len(lines)):
        if lines[index].strip() == "---":
            end_index = index
            break
    if end_index is None:
        raise FrontmatterError("frontmatter is missing its closing '---'")
    frontmatter = "".join(lines[1:end_index])
    body = "".join(lines[end_index + 1:])
    body_start_line = end_index + 2
    return _parse_frontmatter(frontmatter), body, body_start_line


def _line_number(text, index, start_line=1):
    return start_line + text[:index].count("\n")


def _section_after_heading(body, heading):
    match = re.search(rf"(?m)^## {re.escape(heading)}[ \t]*$", body)
    if not match:
        return None, None
    following = body[match.end():]
    next_heading = re.search(r"(?m)^## [^\n]+$", following)
    if next_heading:
        following = following[:next_heading.start()]
    return match, following


def _strip_components_for_word_count(body):
    value = body
    paired = re.compile(
        r"<([A-Z][A-Za-z0-9_.]*)\b[^>]*>.*?</\1\s*>",
        flags=re.DOTALL,
    )
    while True:
        stripped = paired.sub(" ", value)
        if stripped == value:
            break
        value = stripped
    return re.sub(r"<[^>]+>", " ", value, flags=re.DOTALL)


def _external_targets(text):
    targets = []
    for match in re.finditer(
        r"href\s*=\s*(['\"])(.*?)\1", text, flags=re.IGNORECASE | re.DOTALL
    ):
        targets.append((match.group(2).strip(), match.start(2)))
    for match in re.finditer(r"\[[^\]]*\]\(([^\s)]+)", text):
        targets.append((match.group(1).strip("<>"), match.start(1)))
    return targets


def _is_vendor_url(target):
    candidate = target
    if candidate.startswith("//"):
        candidate = "https:" + candidate
    parsed = urlparse(candidate)
    return bool(parsed.hostname and parsed.hostname.lower().rstrip(".") in VENDOR_HOSTS)


def run_checks(path, verbose=False):
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as exc:
        print(f"FAIL: could not read '{path}': {exc}")
        print("SUMMARY: 0 passed, 1 failed.")
        return 1

    results = []

    def record(number, passed, success, failure):
        results.append((number, passed, success if passed else failure))

    try:
        frontmatter, body, body_start_line = _extract_frontmatter(text)
        frontmatter_error = None
    except FrontmatterError as exc:
        frontmatter = {}
        body = text
        body_start_line = 1
        frontmatter_error = str(exc)

    missing = [key for key in REQUIRED_FRONTMATTER if key not in frontmatter]
    empty = [
        key for key in ("title", "description", "category", "primaryKeyword")
        if key in frontmatter and (
            not isinstance(frontmatter[key], str) or not frontmatter[key].strip()
        )
    ]
    keywords_valid = (
        isinstance(frontmatter.get("keywords"), list)
        and bool(frontmatter.get("keywords"))
        and all(
            isinstance(keyword, str) and keyword.strip()
            for keyword in frontmatter.get("keywords", [])
        )
    )
    category_valid = frontmatter.get("category") in ALLOWED_CATEGORIES
    frontmatter_valid = (
        frontmatter_error is None
        and not missing
        and not empty
        and keywords_valid
        and category_valid
    )
    frontmatter_problems = []
    if frontmatter_error:
        frontmatter_problems.append(frontmatter_error)
    if missing:
        frontmatter_problems.append(f"missing keys: {', '.join(missing)}")
    if empty:
        frontmatter_problems.append(f"empty or non-string keys: {', '.join(empty)}")
    if "keywords" in frontmatter and not keywords_valid:
        frontmatter_problems.append("keywords must be a non-empty list of strings")
    if "category" in frontmatter and not category_valid:
        frontmatter_problems.append(
            f"category '{frontmatter.get('category')}' is not allowed"
        )
    record(
        1,
        frontmatter_valid,
        "frontmatter is valid and has every required field",
        "frontmatter contract failed: " + "; ".join(frontmatter_problems),
    )

    description = frontmatter.get("description")
    description_length = len(description) if isinstance(description, str) else 0
    record(
        2,
        110 <= description_length <= 160,
        f"description length is {description_length} characters",
        f"description length is {description_length}; expected 110-160",
    )

    record(
        3,
        frontmatter.get("draft") is True,
        "draft is true",
        f"draft must be true (found {frontmatter.get('draft')!r})",
    )

    markdown_h1 = re.search(r"(?m)^# ", body)
    html_h1 = re.search(r"<h1", body, flags=re.IGNORECASE)
    h1_match = markdown_h1 or html_h1
    record(
        4,
        h1_match is None,
        "body has no H1",
        (
            f"body H1 found on line {_line_number(body, h1_match.start(), body_start_line)}: "
            f"{h1_match.group(0)!r}"
            if h1_match else "body contains an H1"
        ),
    )

    takeaways = body.find("<KeyTakeaways")
    first_h2 = re.search(r"(?m)^## ", body)
    takeaways_valid = takeaways >= 0 and (
        first_h2 is None or takeaways < first_h2.start()
    )
    record(
        5,
        takeaways_valid,
        "KeyTakeaways appears before the first H2",
        (
            "KeyTakeaways is missing"
            if takeaways < 0
            else "KeyTakeaways must appear before the first H2"
        ),
    )

    missing_components = [
        component for component in ("DataTable", "Checklist", "Figure")
        if f"<{component}" not in body
    ]
    record(
        6,
        not missing_components,
        "DataTable, Checklist, and Figure are present",
        f"missing required components: {', '.join(missing_components)}",
    )

    sources_match, sources_span = _section_after_heading(body, "Sources")
    source_count = sources_span.count("href:") if sources_span is not None else 0
    record(
        7,
        sources_match is not None and source_count >= 6,
        f"Sources section has {source_count} entries",
        (
            "literal '## Sources' heading is missing"
            if sources_match is None
            else f"Sources section has {source_count} href entries; expected at least 6"
        ),
    )

    faq_match, faq_span = _section_after_heading(body, "FAQ")
    faq_count = faq_span.count("question:") if faq_span is not None else 0
    record(
        8,
        faq_match is not None and faq_count >= 3,
        f"FAQ section has {faq_count} entries",
        (
            "literal '## FAQ' heading is missing"
            if faq_match is None
            else f"FAQ section has {faq_count} question entries; expected at least 3"
        ),
    )

    latex = re.search(r"\$\$|\\[A-Za-z]+(?:\s*\{|\b)", body)
    record(
        9,
        latex is None,
        "body has no raw LaTeX",
        (
            f"raw LaTeX {latex.group(0)!r} found on line "
            f"{_line_number(body, latex.start(), body_start_line)}"
            if latex else "raw LaTeX found"
        ),
    )

    raw_markdown_link = re.search(r"\]\(/", body)
    raw_href = re.search(r"href\s*=\s*['\"]/", body, flags=re.IGNORECASE)
    internal_link = raw_markdown_link or raw_href
    record(
        10,
        internal_link is None,
        "body has no hand-typed internal href",
        (
            f"hand-typed internal link {internal_link.group(0)!r} found on line "
            f"{_line_number(body, internal_link.start(), body_start_line)}"
            if internal_link else "hand-typed internal link found"
        ),
    )

    # This count is intentionally approximate. Paired capitalized components
    # and their internal prose are excluded so FAQ answers, checklist details,
    # and similar props do not inflate the total artificially. A result close
    # to the 3000-word floor deserves a human glance, not blind trust.
    countable_body = _strip_components_for_word_count(body)
    word_count = len(re.findall(r"\S+", countable_body))
    record(
        11,
        word_count >= 3000,
        f"approximate body word count is {word_count}",
        f"approximate body word count is {word_count}; expected at least 3000",
    )

    image = re.search(r"<img|!\[|<Image", text, flags=re.IGNORECASE)
    record(
        12,
        image is None,
        "file has no raster image references",
        (
            f"image reference {image.group(0)!r} found on line "
            f"{_line_number(text, image.start())}"
            if image else "image reference found"
        ),
    )

    vendor_text = re.search(r"babylovegrowth", text, flags=re.IGNORECASE)
    record(
        13,
        vendor_text is None,
        "file does not name babylovegrowth",
        (
            f"vendor name {vendor_text.group(0)!r} found on line "
            f"{_line_number(text, vendor_text.start())}"
            if vendor_text else "vendor name found"
        ),
    )

    vendor_target = next(
        ((target, index) for target, index in _external_targets(text) if _is_vendor_url(target)),
        None,
    )
    record(
        14,
        vendor_target is None,
        "file has no babylovegrowth links",
        (
            f"vendor link {vendor_target[0]!r} found on line "
            f"{_line_number(text, vendor_target[1])}"
            if vendor_target else "vendor link found"
        ),
    )

    for number, passed, message in results:
        if verbose or not passed:
            prefix = "PASS" if passed else "FAIL"
            print(f"{prefix}: [{number}] {message}")
    passed_count = sum(1 for _, passed, _ in results if passed)
    failed_count = len(results) - passed_count
    print(f"SUMMARY: {passed_count} passed, {failed_count} failed.")
    return 0 if failed_count == 0 else 1


def main():
    parser = argparse.ArgumentParser(
        description="Check a sanitized outsourced Applied article MDX file."
    )
    parser.add_argument("path", type=Path)
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()
    return run_checks(args.path, verbose=args.verbose)


if __name__ == "__main__":
    sys.exit(main())
