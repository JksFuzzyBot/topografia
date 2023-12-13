"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

interface iAuthContext {
  signed: boolean;
  setUser: Dispatch<SetStateAction<undefined>>;
  router: AppRouterInstance;
  isAuthenticated(): Promise<boolean>;
}

const AuthContext = createContext<iAuthContext>({} as iAuthContext);

export const AuthProvider: React.FC<any> = ({ children }) => {
  const [user, setUser] = useState();
  const router = useRouter();

  async function isAuthenticated() {
    return true;
  }

  useEffect(() => {
    if (!user) {
      isAuthenticated();
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        setUser,
        router,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
