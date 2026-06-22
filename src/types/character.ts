export type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: CharacterLocation;
  location: CharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
};

export type CharactersResponse = {
  info: CharactersInfo;
  results: Character[];
};

export type CharacterLocation = {
  name: string;
  url: string;
};

export type CharactersInfo = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
};
