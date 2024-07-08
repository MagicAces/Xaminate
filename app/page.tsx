import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/home.module.scss";
import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";

import { usePrefetchQueries } from "@/server/hooks/prefetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Content from "@/components/Home/Content";

export const metadata: Metadata = {
  title: "Xaminate | Home",
};

export default async function Home() {
  const queryClient = new QueryClient();

  await usePrefetchQueries(queryClient);

  return (
    <>
      <section className={`${styles.homeSection} ${GeistSans.className}`}>
        <Sidebar />
        <div className={styles.homeContainer}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Header />
            <Content />
          </HydrationBoundary>
        </div>
      </section>
    </>
  );
}
