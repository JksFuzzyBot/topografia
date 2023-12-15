"use client";
import Button from "@/components/Button";
import InputComponent from "@/components/Input";
import { enterpriseData } from "@/constants/data";
import AuthContext from "@/context/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { toast } from "react-toastify";

const loginSchema = yup.object({
  email: yup.string().required("E-mail obrigatório"),
  password: yup.string().required("Senha obrigatória"),
});

const LoginPage = () => {
  const { links } = enterpriseData;

  const { isAuthenticated, loginFunction } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(loginFunction)}
        className="w-[350px] text-center"
      >
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
