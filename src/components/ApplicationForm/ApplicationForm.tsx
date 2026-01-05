import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useUpdateApplication } from '../../hooks/useUpdateApplication';
import { CustomButton } from '../common/CustomButton/CustomButton';
import { InputBase } from './components/InputBase/InputBase';
import './ApplicationForm.css';
import type { Applicant, Application } from '../../types';
import { useI18n } from '../../i18n/I18nContext';
import {
  validateApplicationForm,
  validationErrorMap,
  type FormErrors,
  type ValidationErrorType,
} from '../../utils/form';

export interface ApplicationFormProps {
  application: Application;
}

export const ApplicationForm = ({ application }: ApplicationFormProps) => {
  const { t } = useI18n();
  const { updateApplication, loading, error } = useUpdateApplication();
  const applicant = application.applicants?.[0];

  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<Applicant>({
    firstName: applicant.firstName || '',
    lastName: applicant.lastName || '',
    email: applicant.email || '',
    phone: applicant.phone || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (errors[name as keyof Applicant]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    // Clear success message on change
    if (showSuccess) {
      setShowSuccess(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateApplicationForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await updateApplication(application.id, {
        productId: application.productId,
        applicants: [formData],
      });
      setShowSuccess(true);
    } catch {
      console.log(t('general.error.message'));
    }
  };

  const getErrorMessage = (type?: ValidationErrorType) =>
    type ? t(validationErrorMap[type]) : undefined;

  return (
    <div className="application-form-container">
      <h2 className="application-form-title">{t('application.form.title')}</h2>
      {error && (
        <div className="error-banner">
          {t('application.form.error.message')}
        </div>
      )}
      {showSuccess && (
        <div className="success-banner">
          {t('application.form.success.message')}
        </div>
      )}
      <form className="application-form" onSubmit={handleSubmit} noValidate>
        <InputBase
          label={t('application.form.firstName.label')}
          type="text"
          name="firstName"
          onChange={handleChange}
          value={formData.firstName}
          error={getErrorMessage(errors.firstName)}
          disabled={loading}
          required
        />
        <InputBase
          label={t('application.form.lastName.label')}
          type="text"
          name="lastName"
          onChange={handleChange}
          value={formData.lastName}
          error={getErrorMessage(errors.lastName)}
          disabled={loading}
          required
        />
        <InputBase
          label={t('application.form.email.label')}
          type="email"
          name="email"
          onChange={handleChange}
          value={formData.email}
          error={getErrorMessage(errors.email)}
          disabled={loading}
          required
        />
        <InputBase
          label={t('application.form.phone.label')}
          type="tel"
          name="phone"
          onChange={handleChange}
          value={formData.phone}
          error={getErrorMessage(errors.phone)}
          disabled={loading}
          required
        />
        <div className="application-form-actions">
          <CustomButton
            className="application-form-button"
            disabled={loading}
            loading={loading}
          >
            {t('application.form.submit.button.text')}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};
