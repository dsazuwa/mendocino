export type LocationView = {
  placeId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}[];

export type ElementValueType = { text: string; value: number };

export type ElementType = {
  distance: ElementValueType;
  duration: ElementValueType;
  duration_in_traffic: ElementValueType;
};

export type DistanceMatrixResponse = {
  origin_addresses: string;
  destination_addresses: string[];
  rows: { elements: ElementType[] }[];
  error_message?: string;
};
