import { getDecadeBlurb, getEraBlurb, getEraName, getErasForRange } from '../../lib/eras'

describe('getDecadeBlurb', () => {
  it('returns the 1970s blurb for year 1975', () => {
    expect(getDecadeBlurb(1975)).toContain('stagflation')
  })
  it('returns the 1910s blurb for year 1913', () => {
    expect(getDecadeBlurb(1913)).toContain('Federal Reserve')
  })
  it('returns a non-empty string for every year 1913–2024', () => {
    for (let y = 1913; y <= 2024; y++) {
      expect(getDecadeBlurb(y).length).toBeGreaterThan(0)
    }
  })
})

describe('getEraBlurb', () => {
  it('returns stagflation blurb for 1975', () => {
    expect(getEraBlurb(1975)).toContain('oil')
  })
  it('returns a non-empty string for every year 1913–2024', () => {
    for (let y = 1913; y <= 2024; y++) {
      expect(getEraBlurb(y).length).toBeGreaterThan(0)
    }
  })
})

describe('getEraName', () => {
  it('returns "Stagflation" for 1975', () => {
    expect(getEraName(1975)).toBe('Stagflation')
  })
  it('returns "Postwar Boom" for 1950', () => {
    expect(getEraName(1950)).toBe('Postwar Boom')
  })
  it('returns "COVID & Post-COVID" for 2022', () => {
    expect(getEraName(2022)).toBe('COVID & Post-COVID')
  })
})

describe('getErasForRange', () => {
  it('returns one era when range is within a single era', () => {
    const eras = getErasForRange(1950, 1960)
    expect(eras).toHaveLength(1)
    expect(eras[0].name).toBe('Postwar Boom')
  })
  it('returns multiple eras for a cross-era range', () => {
    const eras = getErasForRange(1965, 1990)
    expect(eras.length).toBeGreaterThanOrEqual(3)
    expect(eras.map((e) => e.name)).toContain('Stagflation')
  })
  it('returns eras in chronological order', () => {
    const eras = getErasForRange(1960, 2000)
    for (let i = 1; i < eras.length; i++) {
      expect(eras[i].startYear).toBeGreaterThan(eras[i - 1].startYear)
    }
  })
  it('returns exactly 1 era when range falls entirely within a single era', () => {
    // "Great Society & Vietnam" spans 1965–1973. Using fromYear=1965 (exclusive,
    // so "Postwar Boom" with endYear=1965 is excluded) and toYear=1972 (which is
    // less than "Stagflation" startYear=1973) should yield exactly 1 era.
    const eras = getErasForRange(1965, 1972)
    expect(eras).toHaveLength(1)
    expect(eras[0].name).toBe('Great Society & Vietnam')
  })
  it('excludes era whose endYear equals fromYear (fromYear is exclusive)', () => {
    // "Postwar Boom" ends at 1965; fromYear 1965 should exclude it.
    const eras = getErasForRange(1965, 1973)
    expect(eras.map((e) => e.name)).not.toContain('Postwar Boom')
  })
  it('includes era whose startYear equals toYear (toYear is inclusive)', () => {
    // "Stagflation" starts at 1973; toYear 1973 should include it.
    const eras = getErasForRange(1965, 1973)
    expect(eras.map((e) => e.name)).toContain('Stagflation')
  })
  it('getErasForRange(1965, 1973) returns exactly "Great Society & Vietnam" and "Stagflation"', () => {
    const eras = getErasForRange(1965, 1973)
    expect(eras).toHaveLength(2)
    expect(eras[0].name).toBe('Great Society & Vietnam')
    expect(eras[1].name).toBe('Stagflation')
  })
})
