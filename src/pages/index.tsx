import Head from "next/head";
import Link from "next/link";
import Editor from "../components/editor";
import LoginButton from "../components/login-btn";

export default function Home() {
  return (
    <>
      <main className="flex">
        <LoginButton />
        <Editor />
      </main>
    </>
  );
}
