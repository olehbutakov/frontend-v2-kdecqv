import React, { type ReactNode } from 'react';
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
        {columns.map((column) => (
          <div key={String(column.key)} className="table-cell header-cell">
            {column.header}
          </div>
        ))}

        {data.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
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
                  {content}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
