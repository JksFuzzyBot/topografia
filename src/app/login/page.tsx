"use client";
import Button from "@/components/Button";
import InputComponent from "@/components/Input";
import { enterpriseData } from "@/constants/data";
import AuthContext from "@/context/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const Parse = require("parse/dist/parse.min.js");

const loginSchema = yup.object({
  email: yup.string().required("E-mail obrigatório"),
  password: yup.string().required("Senha obrigatória"),
});

const LoginPage = () => {
  const PARSE_APPLICATION_ID = process.env.NEXT_PUBLIC_Key_Application_ld;
  const PARSE_JAVASCRIPT_KEY = process.env.NEXT_PUBLIC_Key_JS_Key;
  const PARSE_HOST_URL = process.env.NEXT_PUBLIC_Key_Parse_Server_Url;

  // Your Parse initialization configuration goes here
  Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
  Parse.serverURL = PARSE_HOST_URL;

  const { links } = enterpriseData;

  const { router, isAuthenticated } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    isAuthenticated();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: any) => {
    router.push("/dashboard");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[350px] text-center">
        <InputComponent
          placeholder="E-mail"
          register={register("email")}
          error={errors?.email?.message}
        />
        <InputComponent
          placeholder="Senha"
          register={register("password")}
          type="password"
          error={errors?.password?.message}
        />
        <Button
          className="text-white bg-blue-500 p-2 rounded mt-2"
          type="submit"
        >
          Entrar
        </Button>
      </form>
      <div className="flex gap-5 mt-12">
        <Button href={links.facebook}>Facebook</Button>
        <Button href={links.instagram}>Instagram</Button>
        <Button href={links.linkedin}>LinkedIn</Button>
      </div>
    </>
  );
};

export default LoginPage;
