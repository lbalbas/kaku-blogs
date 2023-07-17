import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div>Nav</div>
      <main className="my-8">{children}</main>
      <div>Footer</div>
    </>
  );
}
