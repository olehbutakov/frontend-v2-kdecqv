import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import './InputBase.css';

interface InputBaseProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>(
  (props, ref) => {
    const { label, error, id, className, required, ...inputProps } = props;

    const generatedId = useId();
    const inputId = id ?? generatedId;
    const inputClasses =
      `input-base ${error && 'input-error'} ${className || ''}`.trim();

    return (
      <div className="input-wrapper">
        <div className="input-row">
          {label && (
            <label className="input-label" htmlFor={inputId}>
              {label}
              {required && <sup>*</sup>}
            </label>
          )}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            {...inputProps}
          />
        </div>
        {error && <span className="input-error-message">{error}</span>}
      </div>
    );
  }
);
