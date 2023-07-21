import type { ReactNode } from "react";
import Link from 'next/link';
import LoginButton from '~/components/login-btn';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav>
        <div className="w-11/12 mx-auto py-4 flex items-center justify-between">
          <Link href="/">Logo</Link>
          <LoginButton />         
        </div>
      </nav>
      <main className="w-11/12 flex-col mx-auto my-8">{children}</main>
      <footer className="w-11/12 mx-auto text-center py-4">Developed by <a className="underline" href="https://github.com/lbalbas">Luis Balbás</a></footer>
    </>
  );
}
