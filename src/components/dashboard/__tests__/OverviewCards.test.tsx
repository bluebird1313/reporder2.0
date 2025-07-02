import { render, screen } from '@testing-library/react'
import OverviewCards from '../OverviewCards'

describe('OverviewCards', () => {
  const defaultProps = {
    totalItems: 1000,
    totalLowStock: 15,
    totalOutOfStock: 3,
    storeCount: 4
  }

  it('renders all metric cards correctly', () => {
    render(<OverviewCards {...defaultProps} />)
    
    expect(screen.getByText('Total Items')).toBeInTheDocument()
    expect(screen.getByText('1,000')).toBeInTheDocument()
    
    expect(screen.getByText('Low Stock Items')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    
    expect(screen.getByText('Active Stores')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('displays formatted numbers correctly', () => {
    const props = {
      ...defaultProps,
      totalItems: 1234567
    }
    
    render(<OverviewCards {...props} />)
    expect(screen.getByText('1,234,567')).toBeInTheDocument()
  })
}) 