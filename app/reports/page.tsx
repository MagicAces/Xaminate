import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/report.module.scss";
import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";

import { usePrefetchQueries } from "@/server/hooks/prefetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Content from "@/components/Reports/Content";

export const metadata: Metadata = {
  title: "Reports",
};

export default async function REports() {
  const queryClient = new QueryClient();

  await usePrefetchQueries(queryClient);

  return (
    <>
      <section className={`${styles.reportSection} ${GeistSans.className}`}>
        <Sidebar />
        <div className={styles.reportContainer}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Header />
            <Content />
          </HydrationBoundary>
        </div>
      </section>
    </>
  );
}
