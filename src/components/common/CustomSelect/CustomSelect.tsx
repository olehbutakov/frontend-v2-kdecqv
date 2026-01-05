import { useState, useRef, useEffect } from 'react';
import './CustomSelect.css';

export interface Option {
  value: string;
  label: string;
}

export interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export const CustomSelect = ({ options, value, onChange }: SelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setOpen((prev) => !prev);
  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    // Handle ESC keypress
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <div className="custom-select" ref={ref}>
      <button className="select-trigger" onClick={toggleOpen}>
        {options.find((o) => o.value === value)?.label || 'Select...'}
        <span>
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1l4 4 4-4"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            />
          </svg>
        </span>
      </button>

      {open && (
        <ul className="select-dropdown">
          {options.map((option) => (
            <li
              key={option.value}
              className={`select-option ${
                option.value === value ? 'selected' : ''
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
