import type { SelectedItem } from '../store/selectedItemsSlice';

const CSV_HEADERS = ['id', 'name', 'status', 'species', 'gender', 'detailsUrl'];

const escapeCsvValue = (value: string | number): string => {
  const stringValue: string = String(value);

  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n')
  ) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
};

export const createSelectedItemsCsv = (items: SelectedItem[]): string => {
  const rows: string[] = items.map((item) =>
    [
      item.id,
      item.name,
      item.status,
      item.species,
      item.gender,
      item.detailsUrl,
    ]
      .map(escapeCsvValue)
      .join(','),
  );

  return [CSV_HEADERS.join(','), ...rows].join('\n');
};

export const downloadSelectedItemsCsv = (items: SelectedItem[]): void => {
  const csvContent: string = createSelectedItemsCsv(items);
  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `${items.length}_items.csv`;
  link.click();

  URL.revokeObjectURL(url);
};
