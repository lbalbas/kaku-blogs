import type { ReactNode } from "react";
import Link from "next/link";
import LoginButton from "~/components/login-btn";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav>
        <div className="mx-auto flex w-11/12 items-center justify-between py-4">
          <Link href="/">Logo</Link>
          <LoginButton />
        </div>
      </nav>
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
