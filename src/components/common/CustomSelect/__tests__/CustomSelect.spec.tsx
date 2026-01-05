import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CustomSelect } from '../CustomSelect';

const options = [
  { value: 'en-US', label: 'English US' },
  { value: 'fr-CA', label: 'French Canada' },
];
describe('CustomSelect', () => {
  it('renders selected option label', () => {
    render(
      <CustomSelect options={options} value="en-US" onChange={jest.fn()} />
    );

    expect(screen.getByText('English US')).toBeInTheDocument();
  });

  it('renders fallback text when no value is selected', () => {
    render(<CustomSelect options={options} value="" onChange={jest.fn()} />);

    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', () => {
    render(<CustomSelect options={options} value="" onChange={jest.fn()} />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('English US')).toBeInTheDocument();
    expect(screen.getByText('French Canada')).toBeInTheDocument();
  });

  it('calls onChange and closes dropdown when option is clicked', () => {
    const onChange = jest.fn();

    render(<CustomSelect options={options} value="" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('English US'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('en-US');

    expect(screen.queryByText('French Canada')).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', () => {
    render(
      <>
        <CustomSelect options={options} value="" onChange={jest.fn()} />
        <div data-testid="outside">Outside</div>
      </>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('English US')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));

    expect(screen.queryByText('English US')).not.toBeInTheDocument();
  });

  it('closes dropdown when Escape key is pressed', () => {
    render(<CustomSelect options={options} value="" onChange={jest.fn()} />);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('English US')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByText('English US')).not.toBeInTheDocument();
  });

  it('marks the selected option with selected class', () => {
    render(
      <CustomSelect options={options} value="fr-CA" onChange={jest.fn()} />
    );

    fireEvent.click(screen.getByRole('button'));

    const dropdown = screen.getByRole('list');
    const selectedOption = within(dropdown).getByText('French Canada');

    expect(selectedOption).toHaveClass('selected');
  });
});
