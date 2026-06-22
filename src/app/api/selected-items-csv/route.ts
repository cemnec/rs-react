import type { SelectedItem } from '@/types/selectedItem';
import { createSelectedItemsCsv } from '@/utils/csv';

type CsvRequestBody = {
  items: SelectedItem[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSelectedItem(value: unknown): value is SelectedItem {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    Number.isInteger(value.id) &&
    typeof value.name === 'string' &&
    typeof value.status === 'string' &&
    typeof value.species === 'string' &&
    typeof value.gender === 'string' &&
    typeof value.detailsUrl === 'string'
  );
}

function isCsvRequestBody(value: unknown): value is CsvRequestBody {
  return (
    isRecord(value) &&
    Array.isArray(value.items) &&
    value.items.every(isSelectedItem)
  );
}

export async function POST(request: Request): Promise<Response> {
  const body: unknown = await request.json();

  if (!isCsvRequestBody(body)) {
    return Response.json(
      { message: 'Invalid selected items payload' },
      { status: 400 },
    );
  }

  const csv = createSelectedItemsCsv(body.items);

  return new Response(csv, {
    headers: {
      'Content-Disposition': 'attachment; filename="selected-characters.csv"',
      'Content-Type': 'text/csv; charset=utf-8',
    },
  });
}
