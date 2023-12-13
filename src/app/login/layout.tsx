import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Página de login da aplicação",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col w-full items-center pt-20">{children}</main>
  );
}
