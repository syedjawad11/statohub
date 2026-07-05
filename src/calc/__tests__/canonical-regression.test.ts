import { describe, expect, it } from "vitest";
import { binomial } from "../binomial";
import { chiSquare } from "../chi-square";
import { combination } from "../combination";
import { confidenceInterval } from "../confidence-interval";
import { correlation } from "../correlation";
import { factorial } from "../factorial";
import { frequencyTable } from "../frequency-table";
import { linearRegression } from "../linear-regression";
import { mean } from "../mean";
import { meanAbsoluteDeviation } from "../mean-absolute-deviation";
import { median } from "../median";
import { mmmr } from "../mmmr";
import { mode } from "../mode";
import { normalDistribution } from "../normal-distribution";
import { outlier } from "../outlier";
import { percentile } from "../percentile";
import { probability } from "../probability";
import { proportion } from "../proportion";
import { pValue } from "../p-value";
import { range } from "../range";
import { rangeIqr } from "../range-iqr";
import { sampleSize } from "../sample-size";
import { standardDeviation } from "../standard-deviation";
import { tTable } from "../t-table";
import { tTest } from "../t-test";
import { variance } from "../variance";
import { weightedMean } from "../weighted-mean";
import { zScore } from "../z-score";
import { zTable } from "../z-table";

function expectValue(result: { value: number | null }, expected: number, precision = 10) {
  expect(result.value).not.toBeNull();
  expect(result.value as number).toBeCloseTo(expected, precision);
}

describe("canonical calculator regressions", () => {
  describe("mean", () => {
    it("matches canonical values", () => {
      // Hand arithmetic: (2+4+4+4+5+5+7+9)/8 = 40/8 = 5.
      expectValue(mean({ values: [2, 4, 4, 4, 5, 5, 7, 9] }), 5);
      // Edge n=1: 7/1 = 7.
      expectValue(mean({ values: [7] }), 7);
      // Larger hand arithmetic: sum(1..12)=78, 78/12 = 6.5.
      expectValue(mean({ values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }), 6.5);
    });
  });

  describe("median", () => {
    it("matches canonical values", () => {
      // Hand arithmetic: sorted [2,4,4,4,5,5,7,9], middle average (4+5)/2 = 4.5.
      expectValue(median({ values: [2, 4, 4, 4, 5, 5, 7, 9] }), 4.5);
      // Edge n=1: the only sorted value is 7.
      expectValue(median({ values: [7] }), 7);
      // Larger hand arithmetic: sorted [2,3,6,7,9,10,11,12,14], middle value = 9.
      expectValue(median({ values: [12, 3, 7, 9, 14, 2, 6, 10, 11] }), 9);
    });
  });

  describe("mode", () => {
    it("matches canonical values", () => {
      // Hand count: 4 occurs 3 times; all other values occur fewer times.
      expectValue(mode({ values: [2, 4, 4, 4, 5, 5, 7, 9] }), 4);
      // Edge all-tied by frequency: 2 and 3 both occur twice; engine convention returns the lowest tied mode, 2.
      expectValue(mode({ values: [2, 2, 3, 3] }), 2);
      // Larger hand count: 10 occurs 4 times; 2 and 7 occur 3 times.
      expectValue(mode({ values: [2, 2, 2, 5, 7, 7, 7, 10, 10, 10, 10, 12] }), 10);
    });
  });

  describe("range", () => {
    it("matches canonical values", () => {
      // Hand arithmetic: max 9 - min 2 = 7.
      expectValue(range({ values: [2, 4, 4, 4, 5, 5, 7, 9] }), 7);
      // Edge n=1: max 7 - min 7 = 0.
      expectValue(range({ values: [7] }), 0);
      // Larger hand arithmetic: max 42 - min -5 = 47.
      expectValue(range({ values: [-5, 0, 3, 8, 13, 21, 34, 42, 42] }), 47);
    });
  });

  describe("variance", () => {
    it("matches canonical values", () => {
      // Hand arithmetic: mean=5, squared deviations sum=32; sample variance=32/7, population variance=32/8.
      const typical = variance({ values: [2, 4, 4, 4, 5, 5, 7, 9] });
      expectValue(typical, 32 / 7);
      expect(typical.outputs?.population).toBeCloseTo(4, 10);
      // Edge n=2: mean=2, squared deviations 2; sample variance=2/(2-1)=2.
      expectValue(variance({ values: [1, 3] }), 2);
      // Larger hand arithmetic: for 1..12, mean=6.5, squared deviations sum=143; sample variance=143/11=13.
      expectValue(variance({ values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }), 13);
    });
  });

  describe("standardDeviation", () => {
    it("matches canonical values", () => {
      // Hand arithmetic: sample variance=32/7, so sample SD=sqrt(32/7)=2.1380899353.
      const typical = standardDeviation({ values: [2, 4, 4, 4, 5, 5, 7, 9] });
      expectValue(typical, Math.sqrt(32 / 7));
      expect(typical.outputs?.population).toBeCloseTo(2, 10);
      // Edge n=2: sample variance=2, so sample SD=sqrt(2).
      expectValue(standardDeviation({ values: [1, 3] }), Math.sqrt(2));
      // Larger hand arithmetic: for 1..12, sample variance=13, so sample SD=sqrt(13).
      expectValue(standardDeviation({ values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }), Math.sqrt(13));
    });
  });

  describe("meanAbsoluteDeviation", () => {
    it("matches canonical values", () => {
      // Hand arithmetic: mean=5; absolute deviations sum=12; MAD=12/8=1.5.
      expectValue(meanAbsoluteDeviation({ values: [2, 4, 4, 4, 5, 5, 7, 9] }), 1.5);
      // Edge n=1: mean=7; absolute deviation |7-7|=0.
      expectValue(meanAbsoluteDeviation({ values: [7] }), 0);
      // Larger hand arithmetic: for 1..12 mean=6.5; absolute deviations sum=36; MAD=36/12=3.
      expectValue(meanAbsoluteDeviation({ values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }), 3);
    });
  });

  describe("percentile", () => {
    it("matches canonical values", () => {
      // Hand Type 7 arithmetic: sorted [2,4,4,4,5,5,7,9], p=75 gives position .75*(8-1)=5.25, 5 + .25*(7-5)=5.5.
      expectValue(percentile({ values: [2, 4, 4, 4, 5, 5, 7, 9], p: 75 }), 5.5);
      // Edge n=1: Type 7 returns the only value for any p, so p=90 gives 7.
      expectValue(percentile({ values: [7], p: 90 }), 7);
      // Larger hand Type 7 arithmetic: sorted 1..12, p=90 gives position 9.9, 10 + .9*(11-10)=10.9.
      expectValue(percentile({ values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], p: 90 }), 10.9);
    });
  });

  describe("weightedMean", () => {
    it("matches canonical values", () => {
      // Hand arithmetic: (80*0.2 + 90*0.3 + 100*0.5)/(0.2+0.3+0.5) = 93.
      expectValue(weightedMean({ values: [80, 90, 100], weights: [0.2, 0.3, 0.5] }), 93);
      // Edge zero-valued item: (0*1 + 10*1)/(1+1) = 5.
      expectValue(weightedMean({ values: [0, 10], weights: [1, 1] }), 5);
      // Larger hand arithmetic: weighted sum 910, weight sum 21, 910/21 = 43.3333333333.
      expectValue(weightedMean({ values: [10, 20, 30, 40, 50, 60], weights: [1, 2, 3, 4, 5, 6] }), 910 / 21);
    });
  });

  describe("zScore", () => {
    it("matches canonical values", () => {
      // Hand arithmetic: (130-100)/15 = 2.
      expectValue(zScore({ x: 130, mean: 100, sd: 15 }), 2);
      // Edge x equals mean: (10-10)/2 = 0.
      expectValue(zScore({ x: 10, mean: 10, sd: 2 }), 0);
      // Larger-scale hand arithmetic: (72-64)/8 = 1.
      expectValue(zScore({ x: 72, mean: 64, sd: 8 }), 1);
    });
  });

  describe("mmmr", () => {
    it("matches canonical values", () => {
      // Hand arithmetic/counts: mean=5, median=4.5, mode=4, range=7.
      const typical = mmmr({ values: [2, 4, 4, 4, 5, 5, 7, 9] });
      expectValue(typical, 5);
      expect(typical.outputs).toMatchObject({ mean: 5, median: 4.5, mode: 4, range: 7, modalFrequency: 3 });
      // Edge n=1: mean=median=range=7/7/0; mode has no repeated value, modal frequency 1.
      const edge = mmmr({ values: [7] });
      expectValue(edge, 7);
      expect(edge.outputs).toMatchObject({ mean: 7, median: 7, range: 0, modalFrequency: 1 });
      // Larger hand arithmetic/counts: sum=41, n=10, mean=4.1; sorted middle=(4+4)/2=4; mode=4; range=8.
      const larger = mmmr({ values: [1, 2, 2, 3, 4, 4, 4, 5, 7, 9] });
      expectValue(larger, 4.1);
      expect(larger.outputs).toMatchObject({ mean: 4.1, median: 4, mode: 4, range: 8, modalFrequency: 3 });
    });
  });

  describe("rangeIqr", () => {
    it("matches canonical values", () => {
      // Hand Type 7 arithmetic: q1=4, q3=5.5, IQR=1.5; min=2, max=9, range=7.
      const typical = rangeIqr({ values: [2, 4, 4, 4, 5, 5, 7, 9] });
      expectValue(typical, 1.5);
      expect(typical.outputs).toMatchObject({ min: 2, max: 9, range: 7, q1: 4, q2: 4.5, q3: 5.5, iqr: 1.5 });
      // Edge n=1: q1=q2=q3=7, IQR=0.
      expectValue(rangeIqr({ values: [7] }), 0);
      // Larger hand Type 7 arithmetic: sorted 1..12, q1=3.75, q3=9.25, IQR=5.5.
      expectValue(rangeIqr({ values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }), 5.5);
    });
  });

  describe("outlier", () => {
    it("matches canonical values", () => {
      // Hand Type 7 arithmetic: q1=15, q3=16, IQR=1, fences 13.5 and 17.5; only 100 is outside.
      const typical = outlier({ values: [14, 15, 15, 16, 16, 100] });
      expectValue(typical, 1);
      expect(typical.list).toEqual([100]);
      // Edge n=1: q1=q3=7, IQR=0, fences 7 and 7; 7 is not outside.
      expectValue(outlier({ values: [7] }), 0);
      // Larger hand Type 7 arithmetic: for ten 10s plus 50, q1=10, q3=10, fences 10 and 10; only 50 is outside.
      const larger = outlier({ values: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 50] });
      expectValue(larger, 1);
      expect(larger.list).toEqual([50]);
    });
  });

  describe("frequencyTable", () => {
    it("matches canonical values", () => {
      // Hand count: values 1,2,3 occur 1,2,3 times; relative frequencies are 1/6, 2/6, 3/6; cumulative 1,3,6.
      const typical = frequencyTable({ values: [1, 2, 2, 3, 3, 3] });
      expectValue(typical, 6);
      expect(typical.table?.rows).toEqual([[1, 1, 1 / 6, 1], [2, 2, 2 / 6, 3], [3, 3, 3 / 6, 6]]);
      // Edge n=1: value 7 occurs once; relative frequency 1; cumulative 1.
      expect(frequencyTable({ values: [7] }).table?.rows).toEqual([[7, 1, 1, 1]]);
      // Larger hand count: -1 occurs 2, 0 occurs 3, 2 occurs 4, 5 occurs 1; total 10.
      const larger = frequencyTable({ values: [-1, -1, 0, 0, 0, 2, 2, 2, 2, 5] });
      expectValue(larger, 10);
      expect(larger.table?.rows).toEqual([[-1, 2, 0.2, 2], [0, 3, 0.3, 5], [2, 4, 0.4, 9], [5, 1, 0.1, 10]]);
    });
  });

  describe("factorial", () => {
    it("matches canonical values", () => {
      // Hand arithmetic: 5! = 5*4*3*2*1 = 120.
      expectValue(factorial({ n: 5 }), 120);
      // Edge arithmetic: 0! = 1 by definition of the empty product.
      expectValue(factorial({ n: 0 }), 1);
      // Larger hand arithmetic: 10! = 10*9*8*7*6*5*4*3*2*1 = 3628800.
      expectValue(factorial({ n: 10 }), 3628800);
    });
  });

  describe("combination", () => {
    it("matches canonical values", () => {
      // Hand arithmetic: C(10,3) = 10!/(3!*7!) = 120.
      expectValue(combination({ n: 10, r: 3, mode: "nCr" }), 120);
      // Edge arithmetic: C(5,0) = 1.
      expectValue(combination({ n: 5, r: 0, mode: "nCr" }), 1);
      // Larger hand arithmetic: P(12,4) = 12*11*10*9 = 11880.
      expectValue(combination({ n: 12, r: 4, mode: "nPr" }), 11880);
    });
  });

  describe("probability", () => {
    it("matches canonical values", () => {
      // Hand arithmetic: favorable/total = 3/8 = 0.375.
      expectValue(probability({ favorable: 3, total: 8 }), 0.375);
      // Edge arithmetic: 0 favorable outcomes out of 10 gives 0/10 = 0.
      expectValue(probability({ favorable: 0, total: 10 }), 0);
      // Larger hand arithmetic: 125 favorable out of 500 gives 125/500 = 0.25.
      expectValue(probability({ favorable: 125, total: 500 }), 0.25);
    });
  });

  describe("binomial", () => {
    it("matches canonical values", () => {
      // scipy 1.17.1: scipy.stats.binom.pmf(5, 10, 0.5) = 0.24609375.
      expectValue(binomial({ n: 10, p: 0.5, k: 5, mode: "exactly" }), 0.24609375, 10);
      // scipy 1.17.1: scipy.stats.binom.cdf(2, 8, 0.25) = 0.6785430908203125.
      expectValue(binomial({ n: 8, p: 0.25, k: 2, mode: "atMost" }), 0.6785430908203125, 10);
      // scipy 1.17.1: scipy.stats.binom.sf(7, 20, 0.3) = P(X>=8) = 0.22772820258183935.
      expectValue(binomial({ n: 20, p: 0.3, k: 8, mode: "atLeast" }), 0.22772820258183935, 10);
    });
  });

  describe("normalDistribution", () => {
    it("matches canonical values", () => {
      // scipy 1.17.1: scipy.stats.norm.cdf(130, 100, 15) = 0.9772498680518208.
      expectValue(normalDistribution({ mean: 100, sd: 15, x: 130, upper: 0, mode: "lessThan" }), 0.9772498680518208, 4);
      // scipy 1.17.1: scipy.stats.norm.sf(72, 70, 4) = 0.3085375387259869.
      expectValue(normalDistribution({ mean: 70, sd: 4, x: 72, upper: 0, mode: "greaterThan" }), 0.3085375387259869, 4);
      // scipy 1.17.1: scipy.stats.norm.cdf(60, 50, 10) - scipy.stats.norm.cdf(40, 50, 10) = 0.6826894921370859.
      expectValue(normalDistribution({ mean: 50, sd: 10, x: 40, upper: 60, mode: "between" }), 0.6826894921370859, 4);
    });
  });

  describe("zTable", () => {
    it("matches canonical values", () => {
      // scipy 1.17.1: scipy.stats.norm.cdf(1.96) = 0.9750021048517795.
      expectValue(zTable({ z: 1.96 }), 0.9750021048517795, 4);
      // scipy 1.17.1: scipy.stats.norm.cdf(0) = 0.5.
      expectValue(zTable({ z: 0 }), 0.5, 8);
      // scipy 1.17.1: scipy.stats.norm.cdf(2.33) = 0.9900969244408357.
      expectValue(zTable({ z: 2.33 }), 0.9900969244408357, 4);
    });
  });

  describe("confidenceInterval", () => {
    it("matches canonical values", () => {
      // scipy 1.17.1: z=scipy.stats.norm.ppf(1-(1-0.95)/2)=1.959963984540054; SE=15/sqrt(25)=3; margin=z*3=5.879891953620162.
      expectValue(confidenceInterval({ mean: 100, sd: 15, n: 25, level: "0.95" }), 5.879891953620162, 4);
      // scipy 1.17.1: z=scipy.stats.norm.ppf(1-(1-0.90)/2)=1.6448536269514722; SE=2/sqrt(4)=1; margin=1.6448536269514722.
      expectValue(confidenceInterval({ mean: 10, sd: 2, n: 4, level: "0.90" }), 1.6448536269514722, 4);
      // scipy 1.17.1: z=scipy.stats.norm.ppf(1-(1-0.99)/2)=2.5758293035489004; SE=12/sqrt(144)=1; margin=2.5758293035489004.
      expectValue(confidenceInterval({ mean: 80, sd: 12, n: 144, level: "0.99" }), 2.5758293035489004, 4);
    });
  });

  describe("sampleSize", () => {
    it("matches canonical values", () => {
      // scipy 1.17.1: z=scipy.stats.norm.ppf(1-(1-0.95)/2)=1.959963984540054; ceil(z^2*.5*.5/.05^2)=385.
      expectValue(sampleSize({ level: "0.95", margin: 0.05, p: 0.5 }), 385);
      // scipy 1.17.1: z=scipy.stats.norm.ppf(1-(1-0.90)/2)=1.6448536269514722; ceil(z^2*.5*.5/.10^2)=68.
      expectValue(sampleSize({ level: "0.90", margin: 0.1, p: 0.5 }), 68);
      // scipy 1.17.1: z=scipy.stats.norm.ppf(1-(1-0.99)/2)=2.5758293035489004; z^2*.35*.65/.03^2=1677.1544185914736, ceil(...) = 1678.
      expectValue(sampleSize({ level: "0.99", margin: 0.03, p: 0.35 }), 1678);
    });
  });

  describe("correlation", () => {
    it("matches canonical values", () => {
      // TASK-015 anchored dataset: x=[1,2,3,4,5], y=[2,4,5,4,5]; Sxy=6, Sxx=10, Syy=6; r=6/sqrt(60)=0.7745966692.
      expectValue(correlation({ x: [1, 2, 3, 4, 5], y: [2, 4, 5, 4, 5] }), 0.7745966692414834);
      // Edge perfect positive line: y=2x+1, so r=1.
      expectValue(correlation({ x: [1, 2], y: [3, 5] }), 1);
      // Larger hand arithmetic: y=3x+2 for x=1..10, a perfect positive line, so r=1.
      expectValue(correlation({ x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], y: [5, 8, 11, 14, 17, 20, 23, 26, 29, 32] }), 1);
    });
  });

  describe("linearRegression", () => {
    it("matches canonical values", () => {
      // TASK-015 anchored dataset: Sxy=6, Sxx=10, slope=.6; meanX=3, meanY=4, intercept=4-.6*3=2.2.
      const typical = linearRegression({ x: [1, 2, 3, 4, 5], y: [2, 4, 5, 4, 5] });
      expectValue(typical, 0.6);
      expect(typical.outputs?.intercept).toBeCloseTo(2.2, 10);
      // Edge two-point line through (1,3),(2,5): slope=(5-3)/(2-1)=2, intercept=1.
      const edge = linearRegression({ x: [1, 2], y: [3, 5] });
      expectValue(edge, 2);
      expect(edge.outputs?.intercept).toBeCloseTo(1, 10);
      // Larger hand arithmetic: y=3x+2 for x=1..10, so slope=3 and intercept=2.
      const larger = linearRegression({ x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], y: [5, 8, 11, 14, 17, 20, 23, 26, 29, 32] });
      expectValue(larger, 3);
      expect(larger.outputs?.intercept).toBeCloseTo(2, 10);
    });
  });

  describe("pValue", () => {
    it("matches canonical values", () => {
      // scipy 1.17.1: 2*scipy.stats.norm.sf(1.96) = 0.04999579029644087.
      expectValue(pValue({ statistic: 1.96, distribution: "z", tail: "two" }), 0.04999579029644087, 4);
      // scipy 1.17.1: scipy.stats.norm.sf(0) = 0.5.
      expectValue(pValue({ statistic: 0, distribution: "z", tail: "right" }), 0.5, 8);
      // scipy 1.17.1: scipy.stats.t.cdf(-2.5, 12) = 0.013957699785662622.
      expectValue(pValue({ statistic: -2.5, df: 12, distribution: "t", tail: "left" }), 0.013957699785662622, 4);
    });
  });

  describe("tTest", () => {
    it("matches canonical values", () => {
      // scipy 1.17.1: t=(105-100)/(15/sqrt(25))=1.6666666667; 2*scipy.stats.t.sf(abs(t), 24)=0.10858012302472302.
      const typical = tTest({ sampleMean: 105, populationMean: 100, sampleSd: 15, n: 25 });
      expectValue(typical, 5 / 3);
      expect(typical.outputs?.pValue).toBeCloseTo(0.10858012302472302, 4);
      // scipy 1.17.1: t=(12-10)/(2/sqrt(4))=2; 2*scipy.stats.t.sf(abs(2), 3)=0.13932596855884305.
      const edge = tTest({ sampleMean: 12, populationMean: 10, sampleSd: 2, n: 4 });
      expectValue(edge, 2);
      expect(edge.outputs?.pValue).toBeCloseTo(0.13932596855884305, 4);
      // scipy 1.17.1: t=(51.8-50)/(4.2/sqrt(64))=3.4285714286; 2*scipy.stats.t.sf(abs(t), 63)=0.0010747006762745603.
      const larger = tTest({ sampleMean: 51.8, populationMean: 50, sampleSd: 4.2, n: 64 });
      expectValue(larger, 3.4285714285714333);
      expect(larger.outputs?.pValue).toBeCloseTo(0.0010747006762745603, 4);
    });
  });

  describe("chiSquare", () => {
    it("matches canonical values", () => {
      // scipy 1.17.1: statistic=sum((O-E)^2/E)=2 for [10,20,30] vs [10,25,25]; scipy.stats.chi2.sf(2, 2)=0.36787944117144245.
      const typical = chiSquare({ observed: [10, 20, 30], expected: [10, 25, 25] });
      expectValue(typical, 2);
      expect(typical.outputs?.pValue).toBeCloseTo(0.36787944117144245, 4);
      // scipy 1.17.1: statistic=((5-10)^2/10)+((15-10)^2/10)=5, df=1; scipy.stats.chi2.sf(5, 1)=0.025347318677468325.
      const edge = chiSquare({ observed: [5, 15], expected: [10, 10] });
      expectValue(edge, 5);
      expect(edge.outputs?.pValue).toBeCloseTo(0.025347318677468325, 4);
      // scipy 1.17.1: statistic=6.32 for [18,22,25,35] vs [25,25,25,25]; scipy.stats.chi2.sf(6.32, 3)=0.09703806460956205.
      const larger = chiSquare({ observed: [18, 22, 25, 35], expected: [25, 25, 25, 25] });
      expectValue(larger, 6.32);
      expect(larger.outputs?.pValue).toBeCloseTo(0.09703806460956205, 4);
    });
  });

  describe("tTable", () => {
    it("matches canonical values", () => {
      // scipy 1.17.1: scipy.stats.t.ppf(1-(1-.95)/2, 10) = 2.2281388519862744.
      expectValue(tTable({ df: 10, level: "0.95", tails: "2" }), 2.2281388519862744, 4);
      // scipy 1.17.1: scipy.stats.t.ppf(.90, 1) = 3.0776835371752544.
      expectValue(tTable({ df: 1, level: "0.90", tails: "1" }), 3.0776835371752544, 4);
      // scipy 1.17.1: scipy.stats.t.ppf(1-(1-.99)/2, 40) = 2.7044592674331622.
      expectValue(tTable({ df: 40, level: "0.99", tails: "2" }), 2.7044592674331622, 4);
    });
  });

  describe("proportion", () => {
    it("matches canonical values", () => {
      // Hand arithmetic: 2/5 = 8/d, so d=(5*8)/2 = 20.
      expectValue(proportion({ a: 2, b: 5, c: 8 }), 20);
      // Edge decimal arithmetic: 0.5/2 = 1.5/d, so d=(2*1.5)/0.5 = 6.
      expectValue(proportion({ a: 0.5, b: 2, c: 1.5 }), 6);
      // Larger hand arithmetic: 120/300 = 36/d, so d=(300*36)/120 = 90.
      expectValue(proportion({ a: 120, b: 300, c: 36 }), 90);
    });
  });
});
