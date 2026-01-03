import { type ButtonHTMLAttributes } from 'react';
import './CustomButton.css';

type CustomButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const CustomButton = ({ children, ...rest }: CustomButtonProps) => {
  return (
    <button className="custom-btn" {...rest}>
      {children}
    </button>
  );
};
