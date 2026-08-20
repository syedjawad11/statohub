#!/usr/bin/env python3
"""Small stdlib-only adapter for the babylovegrowth integrations API.

This module is only used by the offline outsource-content CLI. It never sends
the API key to logs, exception messages, or cache files.
"""
import json
import os
import re
import socket
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen

for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass


API_BASE_URL = "https://api.babylovegrowth.ai/api/integrations"
HERE = Path(__file__).resolve().parent
LIST_CACHE_PATH = HERE / "raw" / "_article-list-cache.json"
REQUEST_TIMEOUT_SECONDS = 30


class APIClientError(RuntimeError):
    """A safe, human-readable API failure that never includes the API key."""


class _HTMLTextExtractor(HTMLParser):
    """Preserve readable text and basic block boundaries while dropping tags."""

    BLOCK_TAGS = {
        "address", "article", "aside", "blockquote", "div", "footer",
        "h1", "h2", "h3", "h4", "h5", "h6", "header", "li", "main",
        "nav", "ol", "p", "pre", "section", "table", "tr", "ul",
    }
    SKIP_TAGS = {"script", "style"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.skip_depth = 0

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag in self.SKIP_TAGS:
            self.skip_depth += 1
            return
        if self.skip_depth:
            return
        if tag == "br":
            self.parts.append("\n")
        elif tag == "li":
            self.parts.append("\n- ")
        elif tag in self.BLOCK_TAGS:
            self.parts.append("\n")

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag in self.SKIP_TAGS:
            if self.skip_depth:
                self.skip_depth -= 1
            return
        if not self.skip_depth and tag in self.BLOCK_TAGS:
            self.parts.append("\n")

    def handle_data(self, data):
        if not self.skip_depth:
            self.parts.append(data)

    def text(self):
        value = "".join(self.parts)
        value = re.sub(r"[ \t\r\f\v]+", " ", value)
        value = re.sub(r" *\n *", "\n", value)
        value = re.sub(r"\n{3,}", "\n\n", value)
        return value.strip()


def _html_to_text(html_value):
    parser = _HTMLTextExtractor()
    parser.feed(str(html_value or ""))
    parser.close()
    return parser.text()


def _base_url():
    override = os.environ.get("BABYLOVEGROWTH_API_BASE_URL", "").strip()
    return (override or API_BASE_URL).rstrip("/")


def _api_key():
    value = os.environ.get("BABYLOVEGROWTH_API_KEY", "").strip()
    if not value:
        raise APIClientError(
            "BABYLOVEGROWTH_API_KEY is not set; configure it before calling the API."
        )
    return value


def _headers(api_key):
    return {
        "X-API-Key": api_key,
        "Content-Type": "application/json",
    }


def _request_json(url):
    request = Request(url, method="GET", headers=_headers(_api_key()))
    try:
        with urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
            status = response.getcode()
            payload = response.read()
    except HTTPError as exc:
        raise APIClientError(
            f"GET {url} failed with HTTP status {exc.code}."
        ) from None
    except (socket.timeout, TimeoutError):
        raise APIClientError(
            f"GET {url} timed out after {REQUEST_TIMEOUT_SECONDS} seconds."
        ) from None
    except URLError as exc:
        if isinstance(exc.reason, (socket.timeout, TimeoutError)):
            raise APIClientError(
                f"GET {url} timed out after {REQUEST_TIMEOUT_SECONDS} seconds."
            ) from None
        raise APIClientError(f"GET {url} failed with a network error.") from None

    if not 200 <= status < 300:
        raise APIClientError(f"GET {url} failed with HTTP status {status}.")
    try:
        return json.loads(payload.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        raise APIClientError(f"GET {url} returned invalid JSON.") from None


def _page_items(response):
    if isinstance(response, list):
        return response
    if isinstance(response, dict):
        for key in ("articles", "items", "results"):
            if isinstance(response.get(key), list):
                return response[key]
        data = response.get("data")
        if isinstance(data, list):
            return data
        if isinstance(data, dict):
            for key in ("articles", "items", "results"):
                if isinstance(data.get(key), list):
                    return data[key]
    raise APIClientError("Article list response did not contain a list of articles.")


def list_articles(limit=50, max_pages=10):
    """
    Paginate the article summaries and overwrite the point-in-time list cache.

    Pagination stops when a page is short or max_pages is reached. Summary
    dictionaries are returned without normalization because the documented API
    does not guarantee their complete field shape.
    """
    if isinstance(limit, bool) or not isinstance(limit, int) or not 1 <= limit <= 500:
        raise ValueError("limit must be an integer from 1 through 500.")
    if (
        isinstance(max_pages, bool)
        or not isinstance(max_pages, int)
        or max_pages < 1
    ):
        raise ValueError("max_pages must be a positive integer.")

    combined = []
    for page_number in range(max_pages):
        offset = page_number * limit
        query = urlencode((("limit", limit), ("offset", offset)))
        url = f"{_base_url()}/v1/articles?{query}"
        items = _page_items(_request_json(url))
        for item_index, item in enumerate(items, start=offset + 1):
            if not isinstance(item, dict):
                print(
                    f"WARNING: article summary {item_index} is not an object; "
                    "keeping it unchanged.",
                    file=sys.stderr,
                )
                continue
            missing = [field for field in ("id", "title") if field not in item]
            if missing:
                print(
                    f"WARNING: article summary {item_index} is missing "
                    f"{', '.join(missing)}; continuing.",
                    file=sys.stderr,
                )
        combined.extend(items)
        if len(items) < limit:
            break

    LIST_CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    LIST_CACHE_PATH.write_text(
        json.dumps(combined, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return combined


def _article_payload(raw_response):
    if not isinstance(raw_response, dict):
        raise APIClientError("Article response was not a JSON object.")
    for wrapper in ("article", "data"):
        wrapped = raw_response.get(wrapper)
        if isinstance(wrapped, dict):
            return wrapped
    return raw_response


def get_article(article_id):
    """Fetch one full article and return (normalized_dict, raw_response)."""
    if article_id is None or not str(article_id).strip():
        raise ValueError("article_id must not be empty.")
    encoded_id = quote(str(article_id).strip(), safe="")
    url = f"{_base_url()}/v1/articles/{encoded_id}"
    raw_response = _request_json(url)
    payload = _article_payload(raw_response)
    markdown = payload.get("content_markdown")
    if isinstance(markdown, str) and markdown.strip():
        body_markdown = markdown
    else:
        body_markdown = _html_to_text(payload.get("content_html", ""))

    normalized_dict = {
        "babylovegrowth_id": article_id,
        "title": payload.get("title"),
        "body_markdown": body_markdown,
        "slug_source": payload.get("slug"),
        "meta_description": payload.get("meta_description"),
        "language_code": payload.get("languageCode"),
        "published_at": payload.get("publishedAt"),
    }
    return normalized_dict, raw_response


def _redacted_headers():
    return _headers("<redacted>")


def main():
    list_query = urlencode((("limit", 50), ("offset", 0)))
    examples = (
        (f"{_base_url()}/v1/articles?{list_query}", "article list"),
        (f"{_base_url()}/v1/articles/{{id}}", "full article"),
    )
    for url, label in examples:
        print(f"{label}: GET {url}")
        print(f"headers: {json.dumps(_redacted_headers(), sort_keys=True)}")


if __name__ == "__main__":
    main()
