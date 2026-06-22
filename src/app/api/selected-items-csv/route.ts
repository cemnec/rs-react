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

function isSelectedItems(value: unknown): value is SelectedItem[] {
  return Array.isArray(value) && value.every(isSelectedItem);
}

function isCsvRequestBody(value: unknown): value is CsvRequestBody {
  return isRecord(value) && isSelectedItems(value.items);
}

function createInvalidPayloadResponse(): Response {
  return Response.json(
    { message: 'Invalid selected items payload' },
    { status: 400 },
  );
}

async function getItemsFromRequest(request: Request): Promise<unknown> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const body: unknown = await request.json();

    if (!isCsvRequestBody(body)) {
      return undefined;
    }

    return body.items;
  }

  const formData = await request.formData();
  const rawItems = formData.get('items');

  if (typeof rawItems !== 'string') {
    return undefined;
  }

  try {
    return JSON.parse(rawItems) as unknown;
  } catch {
    return undefined;
  }
}

export async function POST(request: Request): Promise<Response> {
  const items = await getItemsFromRequest(request);

  if (!isSelectedItems(items)) {
    return createInvalidPayloadResponse();
  }

  const csv = createSelectedItemsCsv(items);
  const fileName = `${items.length}_items.csv`;

  return new Response(csv, {
    headers: {
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Type': 'text/csv; charset=utf-8',
    },
  });
}
