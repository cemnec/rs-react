import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { RICK_AND_MORTY_API_BASE_URL } from '../constants/api';
import type { Character, CharactersResponse } from '../types/character';

interface GetCharactersQueryArgs {
  searchTerm: string;
  page: number;
}

const DEFAULT_CACHE_TTL_SECONDS = 60;

const getCacheTtlSeconds = (): number => {
  const parsedValue = Number(import.meta.env.VITE_CACHE_TTL_SECONDS);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return DEFAULT_CACHE_TTL_SECONDS;
  }

  return parsedValue;
};

export const charactersApi = createApi({
  reducerPath: 'charactersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: RICK_AND_MORTY_API_BASE_URL,
  }),
  tagTypes: ['Characters', 'Character'],
  keepUnusedDataFor: getCacheTtlSeconds(),
  endpoints: (builder) => ({
    getCharacters: builder.query<CharactersResponse, GetCharactersQueryArgs>({
      query: ({ searchTerm, page }) => {
        const params: Record<string, string> = {
          page: String(page),
        };

        const trimmedSearchTerm = searchTerm.trim();

        if (trimmedSearchTerm) {
          params.name = trimmedSearchTerm;
        }

        return {
          url: 'character',
          params,
        };
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Characters', id: 'LIST' },
              ...result.results.map((character) => ({
                type: 'Character' as const,
                id: character.id,
              })),
            ]
          : [{ type: 'Characters', id: 'LIST' }],
    }),

    getCharacterById: builder.query<Character, string>({
      query: (id) => `character/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Character', id }],
    }),
  }),
});

export const { useGetCharactersQuery, useGetCharacterByIdQuery } =
  charactersApi;
