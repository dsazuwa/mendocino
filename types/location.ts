export type ElementValueType = { text: string; value: number };

export type LocationType = {
  distance: ElementValueType;
  duration: ElementValueType;
  duration_in_traffic: ElementValueType;
  placeId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};
