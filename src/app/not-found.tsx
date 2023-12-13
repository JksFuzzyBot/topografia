"use client";
import AuthContext from "@/context/AuthContext";
import { useContext, useEffect } from "react";

export default function Custom404() {
  const { router } = useContext(AuthContext);

  useEffect(() => {
    setTimeout(() => {
      router.push("/login");
    }, 10000);
  }, []);

  return (
    <h1 className="w-screen h-screen flex items-center justify-center text-3xl">
      404 - Página não encontrada
    </h1>
  );
}
