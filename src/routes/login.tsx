import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Giriş Yap — Süper Lig Fantasy" },
      { name: "description", content: "Süper Lig Fantasy hesabına giriş yap." },
    ],
  }),
  component: () => <AuthForm mode="login" />,
});
