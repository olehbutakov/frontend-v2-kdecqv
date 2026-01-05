import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ApplicationForm } from '../ApplicationForm';
import { useUpdateApplication } from '../../../hooks/useUpdateApplication';
import { useI18n } from '../../../i18n/I18nContext';
import type { Application } from '../../../types/index';

jest.mock('../../../hooks/useUpdateApplication');
jest.mock('../../../i18n/I18nContext');

const mockUpdateApplication = jest.fn();
const mockT = jest.fn((key: string) => {
  const translations: Record<string, string> = {
    'application.form.title': 'Title',
    'application.form.firstName.label': 'First name',
    'application.form.lastName.label': 'Last name',
    'application.form.email.label': 'Email',
    'application.form.phone.label': 'Phone',
    'application.form.submit.button.text': 'Submit',
    'application.form.success.message': 'Success',
    'application.form.error.message': 'Error',
  };
  return translations[key] || key;
});

const mockApplication: Application = {
  productId: 123123,
  id: 'app-123',
  token: 'token-xyz',
  type: 'NEW',
  applicants: [
    {
      phone: '1234567890',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
  ],
  createdAt: '2025-01-01T00:00:00Z',
};

describe('ApplicationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useUpdateApplication as jest.Mock).mockReturnValue({
      updateApplication: mockUpdateApplication,
      loading: false,
      error: null,
    });

    (useI18n as jest.Mock).mockReturnValue({
      t: mockT,
    });

    mockUpdateApplication.mockResolvedValue({});
  });

  it('renders form with all fields', () => {
    render(<ApplicationForm application={mockApplication} />);

    expect(screen.getByLabelText(/First name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
  });

  it('renders form title', () => {
    render(<ApplicationForm application={mockApplication} />);

    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<ApplicationForm application={mockApplication} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('pre-fills form with applicant data', () => {
    render(<ApplicationForm application={mockApplication} />);

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
  });

  it('updates firstName when typing', () => {
    render(<ApplicationForm application={mockApplication} />);

    const input = screen.getByLabelText(/First name/i);
    fireEvent.change(input, { target: { name: 'firstName', value: 'Jane' } });

    expect(input).toHaveValue('Jane');
  });

  it('updates lastName when typing', () => {
    render(<ApplicationForm application={mockApplication} />);

    const input = screen.getByLabelText(/Last name/i);
    fireEvent.change(input, { target: { name: 'lastName', value: 'Smith' } });

    expect(input).toHaveValue('Smith');
  });

  it('updates email when typing', () => {
    render(<ApplicationForm application={mockApplication} />);

    const input = screen.getByLabelText(/Email/i);
    fireEvent.change(input, {
      target: { name: 'email', value: 'jane@example.com' },
    });

    expect(input).toHaveValue('jane@example.com');
  });

  it('updates phone when typing', () => {
    render(<ApplicationForm application={mockApplication} />);

    const input = screen.getByLabelText(/Phone/i);
    fireEvent.change(input, {
      target: { name: 'phone', value: '9876543210' },
    });

    expect(input).toHaveValue('9876543210');
  });

  it('calls updateApplication with correct data on submit', async () => {
    render(<ApplicationForm application={mockApplication} />);

    const form = screen.getByRole('button').closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockUpdateApplication).toHaveBeenCalledWith('app-123', {
        productId: 123123,
        applicants: [
          {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '1234567890',
          },
        ],
      });
    });
  });

  it('shows success message after successful submission', async () => {
    render(<ApplicationForm application={mockApplication} />);

    const form = screen.getByRole('button').closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
    });
  });

  it('does not call updateApplication when form is invalid', async () => {
    render(<ApplicationForm application={mockApplication} />);

    // Clear required field
    const input = screen.getByLabelText(/First name/i);
    fireEvent.change(input, { target: { name: 'firstName', value: '' } });

    const form = screen.getByRole('button').closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockUpdateApplication).not.toHaveBeenCalled();
    });
  });

  it('disables all inputs when loading', () => {
    (useUpdateApplication as jest.Mock).mockReturnValue({
      updateApplication: mockUpdateApplication,
      loading: true,
      error: null,
    });

    render(<ApplicationForm application={mockApplication} />);

    expect(screen.getByLabelText(/First name/i)).toBeDisabled();
    expect(screen.getByLabelText(/Last name/i)).toBeDisabled();
    expect(screen.getByLabelText(/Email/i)).toBeDisabled();
    expect(screen.getByLabelText(/Phone/i)).toBeDisabled();
  });

  it('disables submit button when loading', () => {
    (useUpdateApplication as jest.Mock).mockReturnValue({
      updateApplication: mockUpdateApplication,
      loading: true,
      error: null,
    });

    render(<ApplicationForm application={mockApplication} />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows error banner when there is an error', () => {
    (useUpdateApplication as jest.Mock).mockReturnValue({
      updateApplication: mockUpdateApplication,
      loading: false,
      error: 'Error',
    });

    render(<ApplicationForm application={mockApplication} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});
