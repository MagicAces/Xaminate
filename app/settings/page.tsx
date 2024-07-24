import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/setting.module.scss";
import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";

import { usePrefetchQueries } from "@/server/hooks/prefetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Content from "@/components/Settings/Content";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function Page() {
  const queryClient = new QueryClient();

  await usePrefetchQueries(queryClient);

  return (
    <>
      <section className={`${styles.settingSection} ${GeistSans.className}`}>
        <Sidebar />
        <div className={styles.settingContainer}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Header />
            <Content />
          </HydrationBoundary>
        </div>
      </section>
    </>
  );
}
