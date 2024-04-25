export type Address = AddressData & { id: number };

export type AddressData = {
  placeId: string;
  name: string;
  address: string;
  suite?: string | undefined;
  streetNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  lat: number;
  lng: number;
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
