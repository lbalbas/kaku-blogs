import type { ReactNode } from "react";
import Navbar from "./navbar";
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto my-8 w-11/12 flex-col">{children}</main>
      <footer className="mx-auto w-11/12 py-4 text-center">
        Developed by{" "}
        <a className="underline" href="https://github.com/lbalbas">
          Luis Balbás
        </a>
      </footer>
    </>
  );
}
