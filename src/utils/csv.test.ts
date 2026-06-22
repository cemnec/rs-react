import { describe, expect, it } from 'vitest';

import { mockSelectedRick } from '@/test-utils/mockCharacters';

import { createSelectedItemsCsv } from './csv';

describe('createSelectedItemsCsv', () => {
  it('creates CSV content for selected items', () => {
    const csv = createSelectedItemsCsv([mockSelectedRick]);

    expect(csv).toContain(
      'id,name,description,status,species,gender,detailsUrl',
    );

    expect(csv).toContain(
      '1,Rick Sanchez,"Human, Alive, Male",Alive,Human,Male,/?page=1&selectedId=1',
    );
  });

  it('escapes CSV values with commas and quotes', () => {
    const csv = createSelectedItemsCsv([
      {
        ...mockSelectedRick,
        name: 'Rick, "The Scientist"',
      },
    ]);

    expect(csv).toContain('"Rick, ""The Scientist"""');
  });

  it('uses CRLF line separators', () => {
    const csv = createSelectedItemsCsv([mockSelectedRick]);

    expect(csv).toContain('\r\n');
  });
});
