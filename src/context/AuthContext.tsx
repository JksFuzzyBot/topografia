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
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";

const Parse = require("parse/dist/parse.min.js");

interface iAuthContext {
  signed: boolean;
  user: any;
  setUser: Dispatch<SetStateAction<undefined>>;
  router: AppRouterInstance;
  isAuthenticated(): Promise<void>;
  loginFunction: (data: any) => void;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<iAuthContext>({} as iAuthContext);

export const AuthProvider: React.FC<any> = ({ children }) => {
  const PARSE_APPLICATION_ID = process.env.NEXT_PUBLIC_Key_Application_ld;
  const PARSE_JAVASCRIPT_KEY = process.env.NEXT_PUBLIC_Key_JS_Key;
  const PARSE_HOST_URL = process.env.NEXT_PUBLIC_Key_Parse_Server_Url;

  // Your Parse initialization configuration goes here
  Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
  Parse.serverURL = PARSE_HOST_URL;

  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const loginFunction = (data: any) => {
    const { email, password } = data;
    // Create a new instance of the user class
    Parse.User.logIn(email, password)
      .then(async function (user: any) {
        setUser(user);

        toast.success("Usuário logado com sucesso!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "light",
        });
        router.push("/dashboard");

        secureLocalStorage.setItem("email", email);
        secureLocalStorage.setItem("password", password);
      })
      .catch(function (error: any) {
        toast.error(
          "Houve algum problema ao logar, verifque seu e-mail e senha",
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            theme: "light",
          }
        );
        router.push("/login");
        secureLocalStorage.clear();
      });
  };

  async function isAuthenticated() {
    const email = secureLocalStorage.getItem("email") as string;
    const password = secureLocalStorage.getItem("password") as string;

    loginFunction({ email, password });
  }

  useEffect(() => {
    const email = secureLocalStorage.getItem("email") as string;
    const password = secureLocalStorage.getItem("password") as string;

    if (!user && email && password) {
      isAuthenticated();
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        setUser,
        router,
        isAuthenticated,
        loginFunction,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
