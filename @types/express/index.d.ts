declare global {
  namespace Express {
    interface User {
      id: number,
      status: string,
      role: string
    }
  }
}