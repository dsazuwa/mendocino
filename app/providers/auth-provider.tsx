'use client';

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from 'react';

export type AuthContextType = {
  guestSession: string | undefined;
  setGuestSession: Dispatch<SetStateAction<string | undefined>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type Props = { guestSession?: string; children: ReactNode };

export default function AuthProvider({
  guestSession: session,
  children,
}: Props) {
  const [guestSession, setGuestSession] = useState<string | undefined>(session);

  return (
    <AuthContext.Provider value={{ guestSession, setGuestSession }}>
      {children}
    </AuthContext.Provider>
  );
}
