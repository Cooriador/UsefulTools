export interface Era {
  name: string
  startYear: number
  endYear: number
  blurb: string
}

// Keyed by decade start year; 2020 key covers 2020–2029
const DECADES: Record<number, string> = {
  1910: `The 1910s were shaped by the establishment of the Federal Reserve in 1913, which gave the US a central bank to manage monetary policy. World War I drove massive government spending and wartime inflation. Consumer prices roughly doubled between 1914 and 1920 as demand surged and supply chains strained under the pressures of global conflict and industrial mobilization.`,

  1920: `The 1920s brought dramatic swings from postwar deflation to the prosperity of the Roaring Twenties. After a sharp recession in 1920–21, the economy boomed as mass production, consumer credit, and new technologies like automobiles and radios reshaped daily life. Prices were broadly stable through the decade, disguising underlying financial imbalances that would eventually unravel.`,

  1930: `The 1930s were defined by the Great Depression, the most severe economic contraction in modern history. Prices fell sharply in the early years as banks collapsed, unemployment soared above 25%, and consumer demand evaporated. New Deal programs and monetary expansion eventually stabilized prices by mid-decade, but full recovery required the defense spending buildup ahead of World War II.`,

  1940: `World War II drove the defining economic story of the 1940s. Massive military spending pushed employment to near-zero and consumer prices surged until wage and price controls were imposed. After the war, pent-up demand and the end of rationing unleashed a sharp burst of inflation in 1946–1948. By decade's end, the GI Bill and postwar prosperity were reshaping the American economy.`,

  1950: `The 1950s were a period of broad prosperity and moderate inflation. Returning veterans, rising wages, suburban expansion, and the baby boom fueled consumer demand. The Korean War brought a brief inflationary spike in 1950–51, but the Federal Reserve tightened policy to contain it. For most of the decade, annual inflation remained below 3%, supporting strong real wage growth and rising living standards.`,

  1960: `The 1960s began with price stability but ended with rising inflation. Great Society social programs and Vietnam War spending pushed federal deficits higher without offsetting tax increases. The Federal Reserve accommodated this fiscal expansion, keeping interest rates low. By the end of the decade, inflation was running above 5% annually, setting the stage for the turbulent decade that followed.`,

  1970: `The 1970s were dominated by stagflation — the toxic combination of high inflation and stagnant economic growth. Two oil price shocks, in 1973–74 and 1979–80, sent energy costs soaring and drove headline inflation into double digits. The Federal Reserve struggled to respond, and political pressure prevented aggressive tightening until Paul Volcker's appointment in 1979 signaled a new era of serious inflation-fighting.`,

  1980: `The 1980s opened with the painful Volcker disinflation. The Federal Reserve drove interest rates to nearly 20%, triggering a deep recession in 1981–82 but breaking the back of double-digit inflation. By mid-decade, inflation had fallen dramatically, laying the foundation for the long expansion of the Reagan years. Deregulation, tax cuts, and falling oil prices reinforced the disinflationary trend through the decade.`,

  1990: `The 1990s were a decade of remarkable price stability. Low inflation, budget surpluses, and the longest peacetime expansion on record defined the era. Globalization kept goods prices low as imports from China and other emerging markets grew. The technology boom raised productivity, further moderating price pressures. The Federal Reserve under Alan Greenspan maintained credibility through steady, data-driven monetary policy.`,

  2000: `The 2000s were marked by the collapse of the dot-com bubble, the September 11 attacks, the Iraq War, and ultimately the worst financial crisis since the Great Depression. Inflation remained relatively contained for most of the decade despite rising housing and energy prices. The 2008 financial crisis produced a deflationary shock as credit collapsed, home values plummeted, and the global economy contracted sharply.`,

  2010: `The 2010s were defined by historically low inflation, near-zero interest rates, and the slow recovery from the Great Recession. Massive monetary stimulus from the Federal Reserve — including quantitative easing — failed to generate significant inflation as slack in the labor market persisted for years. Only toward decade's end did the labor market tighten enough to push wages and prices modestly higher.`,

  2020: `The 2020s began with the COVID-19 pandemic, which triggered the sharpest short-term economic contraction since the Depression. Massive fiscal and monetary stimulus fueled a rapid recovery, but supply chain disruptions and surging demand produced the highest inflation in four decades by 2021–2022. The Federal Reserve responded with the fastest rate-hiking cycle in 40 years, gradually bringing inflation back toward its 2% target.`,
}

export const ERAS: Era[] = [
  {
    name: 'World War I & Postwar',
    startYear: 1913,
    endYear: 1920,
    blurb: `The Federal Reserve's founding in 1913 and the onset of World War I in 1914 transformed the US economy. War production drove full employment and surging demand, while imports collapsed. Consumer prices nearly doubled between 1914 and 1920 as government borrowing and money creation fueled wartime spending. A sharp but brief postwar boom preceded a painful deflationary recession in 1920–21.`,
  },
  {
    name: 'Roaring Twenties',
    startYear: 1920,
    endYear: 1929,
    blurb: `After the 1920–21 deflation shock, the US economy roared back. Mass production techniques, especially in the auto industry, drove productivity gains and kept goods prices surprisingly stable even as wages rose. Consumer credit expanded rapidly, fueling purchases of cars, appliances, and homes. Financial speculation ran rampant, and the stock market tripled before the crash of October 1929 exposed the era's fragile foundations.`,
  },
  {
    name: 'Great Depression',
    startYear: 1929,
    endYear: 1939,
    blurb: `The stock market crash of 1929 triggered bank panics, credit contraction, and the worst deflation in modern American history. Consumer prices fell nearly 25% between 1929 and 1933 as unemployment exceeded 25% and output collapsed. Roosevelt's New Deal programs stabilized prices and boosted demand, but a premature fiscal tightening in 1937–38 caused a painful recession-within-depression. Full recovery awaited wartime mobilization.`,
  },
  {
    name: 'World War II',
    startYear: 1939,
    endYear: 1945,
    blurb: `The US entry into World War II following Pearl Harbor transformed the economy virtually overnight. Defense spending surged to over 40% of GDP, unemployment vanished, and inflationary pressures built rapidly. The government responded with comprehensive wage and price controls, rationing, and war bond drives that suppressed spending. Officially measured inflation was moderate, but pent-up demand and informal price pressures were immense.`,
  },
  {
    name: 'Postwar Boom',
    startYear: 1945,
    endYear: 1965,
    blurb: `The end of wartime controls unleashed a burst of inflation in 1946–48 as pent-up consumer demand met supply shortages. After that adjustment, the postwar boom settled into a long era of moderate inflation and strong real growth. The GI Bill, suburban expansion, a baby boom, and rising consumer spending drove prosperity. Inflation averaged around 2% per year through most of the 1950s and early 1960s.`,
  },
  {
    name: 'Great Society & Vietnam',
    startYear: 1965,
    endYear: 1973,
    blurb: `President Johnson's Great Society programs and escalating Vietnam War spending drove federal deficits higher without compensating tax increases. The Federal Reserve, under political pressure to keep rates low, accommodated this fiscal expansion. Inflation, which had been below 2% in the early 1960s, climbed steadily past 5% by 1969. Nixon imposed wage and price controls in 1971, temporarily suppressing inflation while setting the stage for a more severe outbreak.`,
  },
  {
    name: 'Stagflation',
    startYear: 1973,
    endYear: 1982,
    blurb: `The 1973 Arab oil embargo sent oil prices quadrupling almost overnight, triggering a global recession and double-digit US inflation simultaneously. A second oil price shock in 1979–80 doubled energy costs again. The toxic combination of high inflation and high unemployment — stagflation — exposed the limits of traditional demand management. Paul Volcker's appointment as Federal Reserve chairman in 1979 marked the turning point, as aggressive rate hikes eventually broke the inflationary spiral.`,
  },
  {
    name: 'Disinflation',
    startYear: 1982,
    endYear: 1990,
    blurb: `Volcker's medicine worked, but at a steep price: the 1981–82 recession was the deepest since the Depression, with unemployment exceeding 10%. Inflation fell rapidly from above 13% to below 4% by 1983. The subsequent expansion was long and vigorous, supported by falling oil prices, deregulation, and tax cuts. The Federal Reserve established credibility as an inflation fighter, anchoring expectations and keeping prices relatively stable through the rest of the decade.`,
  },
  {
    name: 'Moderate Growth',
    startYear: 1990,
    endYear: 2007,
    blurb: `A mild recession in 1990–91 gave way to the longest US economic expansion on record, running through March 2001. Globalization, technology productivity gains, and Federal Reserve credibility kept inflation low and stable. The 2001 dot-com bust and 9/11 attacks caused a brief, shallow recession. The subsequent expansion was driven by housing and consumer credit, with inflation remaining tame as Chinese goods imports suppressed goods prices globally.`,
  },
  {
    name: 'Financial Crisis',
    startYear: 2007,
    endYear: 2012,
    blurb: `The collapse of the US housing bubble triggered a global financial crisis of historic proportions. As mortgage-backed securities lost value and interbank lending froze, the Federal Reserve slashed rates to zero and deployed emergency lending facilities. The economy contracted sharply in 2008–09, and deflationary pressures emerged as credit collapsed and unemployment surged toward 10%. Massive fiscal stimulus and quantitative easing gradually stabilized conditions, but recovery was painfully slow.`,
  },
  {
    name: 'Low Inflation',
    startYear: 2012,
    endYear: 2020,
    blurb: `The post-crisis recovery was characterized by historically low inflation despite extraordinary monetary stimulus. The Federal Reserve kept rates near zero until 2015, expanded its balance sheet to $4.5 trillion through quantitative easing, yet consistently undershot its 2% inflation target. Labor market slack, globalization, technology-driven price competition, and weak wage growth all contributed to the persistently low inflation environment that puzzled economists throughout the decade.`,
  },
  {
    name: 'COVID & Post-COVID',
    startYear: 2020,
    endYear: 9999,
    blurb: `The COVID-19 pandemic caused the sharpest economic contraction since the Great Depression, followed by an unprecedented policy response. Trillions in fiscal stimulus and near-zero interest rates fueled rapid recovery, but supply chains remained severely disrupted. Surging demand meeting constrained supply produced the highest inflation in 40 years by mid-2021. The Federal Reserve began hiking rates in March 2022 at the fastest pace since Volcker, gradually bringing inflation down from its peak above 9%.`,
  },
]

/**
 * Returns the decade blurb for the given year.
 *
 * Valid input range: 1913–present (years from the CPI dataset).
 * Years before 1910 or after 2029 have no dedicated entry and fall back to
 * the 1910s blurb; callers should only pass years within the CPI dataset range.
 */
export function getDecadeBlurb(year: number): string {
  const decadeStart = Math.floor(year / 10) * 10
  return DECADES[decadeStart] ?? DECADES[1910]
}

/**
 * Returns the era blurb for the given year.
 * Uses startYear <= year < endYear semantics.
 *
 * Valid input range: 1913–present (years from the CPI dataset).
 * Years outside any era (e.g. before 1913) fall back to the first era's blurb;
 * callers should only pass years within the CPI dataset range.
 */
export function getEraBlurb(year: number): string {
  const era = ERAS.find((e) => e.startYear <= year && year < e.endYear)
  return era?.blurb ?? ERAS[0].blurb
}

/**
 * Returns the era name for the given year.
 * Uses startYear <= year < endYear semantics.
 *
 * Valid input range: 1913–present (years from the CPI dataset).
 * Years outside any era (e.g. before 1913) fall back to the first era's name;
 * callers should only pass years within the CPI dataset range.
 */
export function getEraName(year: number): string {
  const era = ERAS.find((e) => e.startYear <= year && year < e.endYear)
  return era?.name ?? ERAS[0].name
}

/**
 * Returns all eras that overlap with the given year range [fromYear, toYear].
 *
 * Boundary semantics: `fromYear` is exclusive and `toYear` is inclusive in the
 * overlap test (`era.endYear > fromYear && era.startYear <= toYear`).  An era
 * whose endYear equals fromYear is therefore NOT included, while an era whose
 * startYear equals toYear IS included.
 *
 * Valid input range: 1913–present (years from the CPI dataset).
 * Results are returned in chronological order.
 */
export function getErasForRange(fromYear: number, toYear: number): Era[] {
  return ERAS.filter((e) => e.endYear > fromYear && e.startYear <= toYear)
}
