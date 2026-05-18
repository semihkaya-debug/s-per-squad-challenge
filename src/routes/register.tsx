import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Kayıt Ol — Süper Lig Fantasy" },
      { name: "description", content: "Süper Lig Fantasy'ye ücretsiz katıl." },
    ],
  }),
  component: () => <AuthForm mode="register" />,
});
