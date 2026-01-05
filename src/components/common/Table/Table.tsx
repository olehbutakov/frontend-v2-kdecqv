import { type ReactNode } from 'react';
import './Table.css';

export interface Column<T> {
  key: keyof T;
  header: string;
  width?: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export const Table = <T extends object>({ data, columns }: TableProps<T>) => {
  const gridTemplateColumns = columns
    .map((col) => col.width || '1fr')
    .join(' ');

  return (
    <div className="table-container">
      <div className="table" style={{ gridTemplateColumns }}>
        <div className="table-header">
          {columns.map((column) => (
            <div key={String(column.key)} className="table-cell header-cell">
              {column.header}
            </div>
          ))}
        </div>

        <div className="table-body">
          {data.map((row, rowIndex) => (
            <div className="table-row" key={rowIndex}>
              {columns.map((column) => {
                const value = row[column.key];
                const content = column.render
                  ? column.render(value, row)
                  : String(value ?? '');

                return (
                  <div
                    key={`${rowIndex}-${String(column.key)}`}
                    className="table-cell"
                  >
                    <span className="table-header-mobile">{column.header}</span>
                    <span className="cell-content">{content}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
