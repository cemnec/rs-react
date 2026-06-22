import { describe, expect, it } from 'vitest';

import { mockSelectedRick } from '@/test-utils/mockCharacters';

import { POST } from './route';

describe('selected-items-csv route', () => {
  it('returns CSV file for valid JSON payload', async () => {
    const request = new Request('http://localhost/api/selected-items-csv', {
      body: JSON.stringify({
        items: [mockSelectedRick],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const response = await POST(request);
    const csv = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe(
      'text/csv; charset=utf-8',
    );
    expect(response.headers.get('Content-Disposition')).toContain(
      '1_items.csv',
    );
    expect(csv).toContain('Rick Sanchez');
  });

  it('returns CSV file for valid form payload', async () => {
    const formBody = new URLSearchParams({
      items: JSON.stringify([mockSelectedRick]),
    });

    const request = new Request('http://localhost/api/selected-items-csv', {
      body: formBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    const response = await POST(request);
    const csv = await response.text();

    expect(response.status).toBe(200);
    expect(csv).toContain('Rick Sanchez');
    expect(csv).toContain('/?page=1&selectedId=1');
  });

  it('returns 400 for invalid JSON payload', async () => {
    const request = new Request('http://localhost/api/selected-items-csv', {
      body: JSON.stringify({
        items: [{ id: 'wrong' }],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Invalid selected items payload',
    });
  });

  it('returns 400 for invalid form payload', async () => {
    const formBody = new URLSearchParams({
      items: 'not-json',
    });

    const request = new Request('http://localhost/api/selected-items-csv', {
      body: formBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('uses selected items count in CSV filename', async () => {
    const secondItem = {
      ...mockSelectedRick,
      detailsUrl: '/?page=1&selectedId=2',
      id: 2,
      name: 'Morty Smith',
    };

    const request = new Request('http://localhost/api/selected-items-csv', {
      body: JSON.stringify({
        items: [mockSelectedRick, secondItem],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const response = await POST(request);

    expect(response.headers.get('Content-Disposition')).toContain(
      '2_items.csv',
    );
  });
});
