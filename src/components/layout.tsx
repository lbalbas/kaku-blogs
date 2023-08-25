import type { ReactNode } from "react";
import Navbar from "./navbar";
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1440px] flex-grow">
        {children}
      </main>
      <footer className="bg-gradient-to-l from-teal-200 to-teal-500 py-4 text-center text-teal-900">
        Developed by{" "}
        <a className="underline" href="https://github.com/lbalbas">
          Luis Balbás
        </a>
      </footer>
    </div>
  );
}
