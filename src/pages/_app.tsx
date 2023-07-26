import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Layout from "../components/layout";
import "react-quill/dist/quill.snow.css";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Toaster
        position={"top-center"}
        toastOptions={{
          duration: 4000,

          // Styling
          style: {},
          className: "",

          // Custom Icon

          // Change colors of success/error/loading icon
          iconTheme: {
            primary: "#000",
            secondary: "#fff",
          },

          // Aria
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
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
