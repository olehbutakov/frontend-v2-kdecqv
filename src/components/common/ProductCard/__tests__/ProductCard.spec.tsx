import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductCard } from '../ProductCard';

jest.mock('../../../../i18n/I18nContext', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../CustomButton/CustomButton', () => ({
  CustomButton: ({
    children,
    onClick,
    disabled,
    loading,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
  }) => (
    <button
      disabled={disabled}
      onClick={onClick}
      data-loading={loading ? 'true' : 'false'}
    >
      {children}
    </button>
  ),
}));

const props = {
  id: 1,
  type: 'Fixed',
  name: 'Personal Loan',
  rate: '5%',
};

describe('ProductCard', () => {
  it('renders product info', () => {
    render(<ProductCard {...props} />);

    expect(screen.getByText('Fixed')).toBeInTheDocument();
    expect(screen.getByText('Personal Loan')).toBeInTheDocument();
    expect(screen.getByText('5%')).toBeInTheDocument();
  });

  it('renders button with translated text', () => {
    render(<ProductCard {...props} />);

    const button = screen.getByText('product.card.button.text');
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('data-loading', 'false');
  });

  it('calls selectHandler on button click', () => {
    const selectHandler = jest.fn();

    render(<ProductCard {...props} selectHandler={selectHandler} />);

    const button = screen.getByText('product.card.button.text');

    fireEvent.click(button);

    expect(selectHandler).toHaveBeenCalledTimes(1);
    expect(selectHandler).toHaveBeenCalledWith(1);
  });

  it('disables select button when prop is provided', () => {
    render(<ProductCard {...props} disabled />);

    const button = screen.getByText('product.card.button.text');

    expect(button).toBeDisabled();
  });

  it('sets proper loading state when prop is provided', () => {
    render(<ProductCard {...props} isLoading />);

    const button = screen.getByText('product.card.button.text');

    expect(button).toHaveAttribute('data-loading', 'true');
  });
});
