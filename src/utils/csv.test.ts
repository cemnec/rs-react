import { describe, expect, it, vi } from 'vitest';

import { mockSelectedRick } from '../test-utils/mockCharacters';
import { createSelectedItemsCsv, downloadSelectedItemsCsv } from './csv';

describe('csv utils', () => {
  it('creates CSV content for selected items', () => {
    const csv = createSelectedItemsCsv([mockSelectedRick]);

    expect(csv).toContain('id,name,status,species,gender,detailsUrl');
    expect(csv).toContain('1,Rick Sanchez,Alive,Human,Male,/characters/1');
  });

  it('escapes CSV values with quotes and commas', () => {
    const csv = createSelectedItemsCsv([
      {
        ...mockSelectedRick,
        name: 'Rick, "The Scientist"',
      },
    ]);

    expect(csv).toContain('"Rick, ""The Scientist"""');
  });

  it('downloads CSV file using native browser APIs', () => {
    const createObjectUrlMock = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:mock-url');

    const revokeObjectUrlMock = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => undefined);

    const clickMock = vi.fn();

    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockReturnValue({
        href: '',
        download: '',
        click: clickMock,
      } as unknown as HTMLAnchorElement);

    downloadSelectedItemsCsv([mockSelectedRick]);

    expect(createObjectUrlMock).toHaveBeenCalledTimes(1);
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrlMock).toHaveBeenCalledWith('blob:mock-url');

    createObjectUrlMock.mockRestore();
    revokeObjectUrlMock.mockRestore();
    createElementSpy.mockRestore();
  });
});
