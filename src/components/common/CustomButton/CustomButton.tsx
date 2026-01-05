import { type ButtonHTMLAttributes } from 'react';
import './CustomButton.css';
import { LogoLoader } from '../LogoLoader/LogoLoader';

export interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const CustomButton = ({
  loading,
  children,
  className,
  ...rest
}: CustomButtonProps) => {
  const buttonClasses = `custom-btn ${className || ''}`.trim();

  return (
    <button className={buttonClasses} {...rest}>
      {loading ? (
        <span className="button-loader">
          <LogoLoader />
        </span>
      ) : (
        children
      )}
    </button>
  );
};
