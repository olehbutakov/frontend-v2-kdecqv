import type { Applicant } from '../../types';
import { validateApplicationForm } from '../form';

const validApplicant: Applicant = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.com',
  phone: '555-555-5555',
};

describe('validateApplicationForm', () => {
  it('returns no errors for valid data', () => {
    const errors = validateApplicationForm(validApplicant);

    expect(errors).toEqual({});
  });

  it('returns fieldRequired errors for empty fields', () => {
    const errors = validateApplicationForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    });

    expect(errors).toEqual({
      firstName: 'fieldRequired',
      lastName: 'fieldRequired',
      email: 'fieldRequired',
      phone: 'fieldRequired',
    });
  });

  it('returns emailInvalid for invalid email', () => {
    const errors = validateApplicationForm({
      ...validApplicant,
      email: 'invalid-email',
    });

    expect(errors).toEqual({
      email: 'emailInvalid',
    });
  });

  it('returns phoneInvalid for invalid phone number', () => {
    const errors = validateApplicationForm({
      ...validApplicant,
      phone: 'abc123',
    });

    expect(errors).toEqual({
      phone: 'phoneInvalid',
    });
  });

  it('returns mixed errors when multiple fields are invalid', () => {
    const errors = validateApplicationForm({
      firstName: '',
      lastName: 'Doe',
      email: 'invalid-email',
      phone: '',
    });

    expect(errors).toEqual({
      firstName: 'fieldRequired',
      email: 'emailInvalid',
      phone: 'fieldRequired',
    });
  });

  it('trims whitespace before validation', () => {
    const errors = validateApplicationForm({
      firstName: '    ',
      lastName: 'Doe',
      email: '    ',
      phone: '555-555-5555',
    });

    expect(errors).toEqual({
      firstName: 'fieldRequired',
      email: 'fieldRequired',
    });
  });
});
