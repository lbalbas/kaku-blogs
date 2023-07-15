import Head from "next/head";
import Link from "next/link";
import Editor from '../components/editor'

export default function Home() {
  return (
    <>
      <Head>
        <title>Kaku Blogs</title>
        <meta name="description" content="Blogging platform made by Luis Balbás using the T3 stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex">
          <Editor />
      </main>
    </>
  );
}