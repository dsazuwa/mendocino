export type Address = {
  suite?: string;
  id: string;
  placeId: string;
  name: string;
  address: string;
  zipCode: string;
};

export type Suggestion = {
  placeId: string;
  name: string;
  address: string;
};

export type SearchResult = {
  autocompleteSuggestions: Suggestion[];
  status: string;
};
