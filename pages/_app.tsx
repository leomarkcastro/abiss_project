import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import Layout from "@/components/layout/main";
import { RouteGuard } from "@/components/auth/routeGuard";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <RouteGuard>
          <Component {...pageProps} />
        </RouteGuard>
      </Layout>
    </SessionProvider>
  );
};

export default App;
