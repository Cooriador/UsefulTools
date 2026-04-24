// __tests__/Calculator.test.tsx
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Calculator from '../components/Calculator'
import type { CPIData } from '../lib/inflation'

const mockCPI: CPIData = {
  '1950': 24.1,
  '1960': 29.6,
  '1970': 38.8,
  '2024': 314.0,
}

describe('Calculator', () => {
  it('renders the adjusted value for default inputs', () => {
    render(
      <Calculator
        cpi={mockCPI}
        defaultAmount={100}
        defaultFromYear={1950}
        defaultToYear={2024}
      />
    )
    // 100 * (314 / 24.1) = ~$1,302.49
    expect(screen.getByText(/\$1,302/)).toBeInTheDocument()
  })

  it('renders cumulative percent', () => {
    render(
      <Calculator
        cpi={mockCPI}
        defaultAmount={100}
        defaultFromYear={1950}
        defaultToYear={2024}
      />
    )
    expect(screen.getByText(/Cumulative inflation/i)).toBeInTheDocument()
  })

  it('updates result when amount input changes', () => {
    render(
      <Calculator
        cpi={mockCPI}
        defaultAmount={100}
        defaultFromYear={1950}
        defaultToYear={2024}
      />
    )
    const input = screen.getByLabelText(/Amount/i)
    fireEvent.change(input, { target: { value: '200' } })
    // 200 * (314 / 24.1) ≈ $2,605.81
    expect(screen.getByText(/\$2,605/)).toBeInTheDocument()
  })

  it('shows from-year label in result', () => {
    render(
      <Calculator
        cpi={mockCPI}
        defaultAmount={100}
        defaultFromYear={1960}
        defaultToYear={2024}
      />
    )
    expect(screen.getByText(/in 1960/)).toBeInTheDocument()
  })
})
