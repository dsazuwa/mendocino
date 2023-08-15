declare namespace Express {
  export interface User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    roles: string[];
    permissions: string[];
  }
}
