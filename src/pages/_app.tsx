import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Layout from "../components/layout";
import "react-quill/dist/quill.snow.css";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Toaster
        position={"top-center"}
        toastOptions={{
          duration: 5000,
          ariaProps: {
            role: "status",
            "aria-live": "polite",
          },
        }}
      />
      <Layout>
        <Head>
          <title>Kaku Blogs</title>
          <meta
            name="description"
            content="Blogging platform made by Luis Balbás using the T3 stack"
          />
          <link rel="icon" href="/logo.svg" />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
