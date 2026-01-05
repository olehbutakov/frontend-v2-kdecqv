import './HamburgerButton.css';

interface HamburgerButtonProps {
  className?: string | undefined;
  onClick: () => void;
}

export const HamburgerButton = ({
  className,
  onClick,
}: HamburgerButtonProps) => {
  const buttonClasses = `hamburger-button ${className || ''}`.trim();

  return (
    <button className={buttonClasses} onClick={onClick}>
      <svg className="hamburger-icon" viewBox="0 0 24 24">
        <path d="M3 6h18v2H3z M3 11h18v2H3z M3 16h18v2H3z" />
      </svg>
    </button>
  );
};
