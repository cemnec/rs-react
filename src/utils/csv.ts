import type { SelectedItem } from '@/types/selectedItem';

const CSV_HEADERS = [
  'id',
  'name',
  'description',
  'status',
  'species',
  'gender',
  'detailsUrl',
] as const;

function escapeCsvValue(value: string | number): string {
  const stringValue = String(value);

  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}

export function createSelectedItemsCsv(items: SelectedItem[]): string {
  const rows = items.map((item) => {
    const description = `${item.species}, ${item.status}, ${item.gender}`;

    return [
      item.id,
      item.name,
      description,
      item.status,
      item.species,
      item.gender,
      item.detailsUrl,
    ]
      .map(escapeCsvValue)
      .join(',');
  });

  return [CSV_HEADERS.join(','), ...rows].join('\r\n');
}
