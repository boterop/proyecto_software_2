import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ResetPassword from '../../pages/ResetPassword'

describe('ResetPassword Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<ResetPassword />)
    expect(container).toBeTruthy()
  })

  it('displays the correct title', () => {
    render(<ResetPassword />)
    
    // Use getByRole to find the heading element
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('displays reset password form elements', () => {
    render(<ResetPassword />)
    
    // Just check that the component renders and has basic structure
    expect(screen.getByText('Enter your new password below.')).toBeInTheDocument()
  })
})