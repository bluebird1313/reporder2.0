import { render, screen, fireEvent } from '@testing-library/react'
import RoleSelector from '../RoleSelector'

describe('RoleSelector', () => {
  const defaultProps = {
    role: 'rep' as const,
    isSignUp: true,
    disabled: false,
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders role options correctly', () => {
    render(<RoleSelector {...defaultProps} />)
    
    expect(screen.getByText('I am a:')).toBeInTheDocument()
    expect(screen.getByText('Sales Rep')).toBeInTheDocument()
    expect(screen.getByText('Store Owner')).toBeInTheDocument()
    expect(screen.getByText('Manage inventory')).toBeInTheDocument()
    expect(screen.getByText('Manage business')).toBeInTheDocument()
  })

  it('changes text for sign in mode', () => {
    render(<RoleSelector {...defaultProps} isSignUp={false} />)
    
    expect(screen.getByText('Sign in as:')).toBeInTheDocument()
  })

  it('calls onChange when role is selected', () => {
    render(<RoleSelector {...defaultProps} />)
    
    const companyOption = screen.getByLabelText(/Store Owner/)
    fireEvent.click(companyOption)
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('company')
  })

  it('disables inputs when disabled prop is true', () => {
    render(<RoleSelector {...defaultProps} disabled={true} />)
    
    const repOption = screen.getByDisplayValue('rep')
    const companyOption = screen.getByDisplayValue('company')
    
    expect(repOption).toBeDisabled()
    expect(companyOption).toBeDisabled()
  })
}) 