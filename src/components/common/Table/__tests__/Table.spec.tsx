import { render, screen } from '@testing-library/react';
import { Table, type Column } from '../Table';

interface TestTableData {
  id: string;
  firstName: string | null;
  phone: string | undefined;
}

const mockData: TestTableData[] = [
  { id: 'abc123', firstName: 'Mike', phone: '111-111-1111' },
  { id: 'abc456', firstName: 'Stan', phone: '222-222-2222' },
  { id: 'abc789', firstName: 'Eve', phone: '333-333-3333' },
];

const mockColumns: Column<TestTableData>[] = [
  { key: 'id', header: 'ID' },
  { key: 'firstName', header: 'Name' },
  { key: 'phone', header: 'Phone' },
];

describe('Table', () => {
  it('renders table with proper data', () => {
    render(<Table data={mockData} columns={mockColumns} />);

    expect(screen.getByText('Mike')).toBeInTheDocument();
    expect(screen.getByText('Stan')).toBeInTheDocument();
    expect(screen.getByText('Eve')).toBeInTheDocument();
  });

  it('renders headers properly', () => {
    render(<Table data={mockData} columns={mockColumns} />);

    const headerCells = screen.getAllByText('ID');

    expect(headerCells.length).toBeGreaterThan(0);
  });

  it('renders all data cells', () => {
    const { container } = render(
      <Table data={mockData} columns={mockColumns} />
    );

    const dataCells = container.querySelectorAll('.table-body .table-cell');
    expect(dataCells).toHaveLength(9);
  });

  it('renders empty table when there is no data', () => {
    const { container } = render(<Table data={[]} columns={mockColumns} />);

    expect(container.querySelector('.table')).toBeInTheDocument();
    const dataCells = container.querySelectorAll('.table-body .table-cell');
    expect(dataCells).toHaveLength(0);
  });

  it('renders mobile table headers for each cell', () => {
    const { container } = render(
      <Table data={mockData} columns={mockColumns} />
    );

    const mobileHeaders = container.querySelectorAll('.table-header-mobile');
    expect(mobileHeaders).toHaveLength(9);
  });

  it('mobile headers contain correct texts', () => {
    const { container } = render(
      <Table data={mockData} columns={mockColumns} />
    );

    const mobileHeaders = container.querySelectorAll('.table-header-mobile');
    const headerTexts = Array.from(mobileHeaders).map(
      (header) => header.textContent
    );

    // We need only first row headers to confirm
    expect(headerTexts[0]).toBe('ID');
    expect(headerTexts[1]).toBe('Name');
    expect(headerTexts[2]).toBe('Phone');
  });

  it('uses custom render function', () => {
    const customColumns: Column<TestTableData>[] = [
      { key: 'id', header: 'ID' },
      {
        key: 'firstName',
        header: 'Name',
        render: (value) => <strong data-testid="custom-name">{value}</strong>,
      },
      { key: 'phone', header: 'Phone' },
    ];

    render(<Table data={mockData} columns={customColumns} />);

    const customElements = screen.getAllByTestId('custom-name');
    expect(customElements).toHaveLength(3);
    expect(customElements[0]).toHaveTextContent('Mike');
  });

  it('handles null and undefined values gracefully', () => {
    const incompleteData = [{ id: 'abc1', firstName: null, phone: undefined }];

    const { container } = render(
      <Table data={incompleteData} columns={mockColumns} />
    );
    const cellContent = container.querySelectorAll('.cell-content');
    expect(cellContent[1]).toHaveTextContent('');
    expect(cellContent[2]).toHaveTextContent('');
  });
});
