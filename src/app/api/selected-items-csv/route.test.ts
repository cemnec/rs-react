import { describe, expect, it } from 'vitest';

import { mockSelectedRick } from '@/test-utils/mockCharacters';

import { POST } from './route';

describe('selected-items-csv route', () => {
  it('returns CSV file for valid selected items payload', async () => {
    const request = new Request('http://localhost/api/selected-items-csv', {
      method: 'POST',
      body: JSON.stringify({
        items: [mockSelectedRick],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const csv = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe(
      'text/csv; charset=utf-8',
    );
    expect(response.headers.get('Content-Disposition')).toContain(
      'selected-characters.csv',
    );
    expect(csv).toContain('Rick Sanchez');
  });

  it('returns 400 for invalid payload', async () => {
    const request = new Request('http://localhost/api/selected-items-csv', {
      method: 'POST',
      body: JSON.stringify({
        items: [{ id: 'wrong' }],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Invalid selected items payload',
    });
  });
});
