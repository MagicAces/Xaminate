import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/session.module.scss";
import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";

import { usePrefetchQueries } from "@/server/hooks/prefetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Content from "@/components/Session/Content";

export const metadata: Metadata = {
  title: "Sessions",
};

export default async function Session() {
  const queryClient = new QueryClient();

  await usePrefetchQueries(queryClient);

  return (
    <>
      <section className={`${styles.sessionSection} ${GeistSans.className}`}>
        <Sidebar />
        <div className={styles.sessionContainer}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Header />
            <Content />
          </HydrationBoundary>
        </div>
      </section>
    </>
  );
}
