import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupportFlow | Solicitações de atendimento",
  description: "Gerenciamento simples e eficiente de solicitações de atendimento.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
