import type { Column } from '../Table';

interface TestTableData {
  id: string;
  firstName: string;
  phone: string;
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
  it('renders table with proper data', () => {});
});
