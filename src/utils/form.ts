import type { TranslationKey } from '../i18n/types';
import type { Applicant } from '../types';

export type ValidationErrorType =
  | 'fieldRequired'
  | 'emailInvalid'
  | 'phoneInvalid';

export const validationErrorMap: Record<ValidationErrorType, TranslationKey> = {
  fieldRequired: 'form.error.required',
  emailInvalid: 'form.error.email.invalid',
  phoneInvalid: 'form.error.phone.invalid',
};

export type FormErrors = Partial<Record<keyof Applicant, ValidationErrorType>>;

export const validateApplicationForm = (data: Applicant): FormErrors => {
  const errors: FormErrors = {};

  if (!data.firstName.trim()) {
    errors.firstName = 'fieldRequired';
  }

  if (!data.lastName.trim()) {
    errors.lastName = 'fieldRequired';
  }

  if (!data.email.trim()) {
    errors.email = 'fieldRequired';
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = 'emailInvalid';
  }

  if (!data.phone.trim()) {
    errors.phone = 'fieldRequired';
  } else if (!/^[\d\s()+-]+$/.test(data.phone)) {
    errors.phone = 'phoneInvalid';
  }

  return errors;
};
