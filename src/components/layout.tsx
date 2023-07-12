import type { ReactNode } from "react";

export default function Layout({ children }: ReactNode) {
  return (
    <>
      <div>Nav</div>
      <main className="">
        {children}
      </main>
      <div>Footer</div>
    </>
  );
}
