import { describeInflationCumulative, describeAnnualRate } from '../../lib/inflation'

describe('describeInflationCumulative', () => {
  it('< 25% → "prices rose modestly"', () => {
    expect(describeInflationCumulative(10)).toBe('prices rose modestly')
    expect(describeInflationCumulative(24.9)).toBe('prices rose modestly')
  })
  it('25–75% → "prices rose significantly"', () => {
    expect(describeInflationCumulative(25)).toBe('prices rose significantly')
    expect(describeInflationCumulative(74.9)).toBe('prices rose significantly')
  })
  it('75–150% → "prices roughly doubled"', () => {
    expect(describeInflationCumulative(75)).toBe('prices roughly doubled')
    expect(describeInflationCumulative(149.9)).toBe('prices roughly doubled')
  })
  it('150–300% → "prices roughly tripled"', () => {
    expect(describeInflationCumulative(150)).toBe('prices roughly tripled')
    expect(describeInflationCumulative(299.9)).toBe('prices roughly tripled')
  })
  it('>= 300% → "prices increased more than fourfold"', () => {
    expect(describeInflationCumulative(300)).toBe('prices increased more than fourfold')
    expect(describeInflationCumulative(500)).toBe('prices increased more than fourfold')
  })
})

describe('describeAnnualRate', () => {
  it('< 1.5% → "well below the historical average"', () => {
    expect(describeAnnualRate(0.5)).toBe('well below the historical average')
    expect(describeAnnualRate(1.49)).toBe('well below the historical average')
  })
  it('1.5–2.5% → "below the historical average"', () => {
    expect(describeAnnualRate(1.5)).toBe('below the historical average')
    expect(describeAnnualRate(2.49)).toBe('below the historical average')
  })
  it('2.5–4% → "roughly in line with the historical average"', () => {
    expect(describeAnnualRate(2.5)).toBe('roughly in line with the historical average')
    expect(describeAnnualRate(3.9)).toBe('roughly in line with the historical average')
  })
  it('4–6% → "above the historical average"', () => {
    expect(describeAnnualRate(4.0)).toBe('above the historical average')
    expect(describeAnnualRate(5.9)).toBe('above the historical average')
  })
  it('>= 6% → "well above the historical average"', () => {
    expect(describeAnnualRate(6.0)).toBe('well above the historical average')
    expect(describeAnnualRate(14.0)).toBe('well above the historical average')
  })
})
