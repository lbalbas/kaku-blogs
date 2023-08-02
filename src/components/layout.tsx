import type { ReactNode } from "react";
import Navbar from "./navbar";
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex-col">{children}</main>
      <footer className="bg-hgreen py-4 text-center text-white">
        Developed by{" "}
        <a className="underline" href="https://github.com/lbalbas">
          Luis Balbás
        </a>
      </footer>
    </>
  );
}
