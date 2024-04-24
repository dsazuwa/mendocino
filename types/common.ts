export type User = {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  roles: string[];
};

export type GenericResponse = { message: string };

export type Address = {
  suite?: string;
  id: string;
  placeId: string;
  name: string;
  address: string;
  zipCode: string;
};

export type StructuredAddress = {
  suite?: string | undefined;
  streetNumber: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
};
