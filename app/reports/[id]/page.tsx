import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Session from "@/components/Session/Session";
import styles from "@/styles/report.module.scss";
import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";

import { usePrefetchReport } from "@/server/hooks/prefetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "Reports",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!isFinite(parseInt(id)) || parseInt(id) < 1) {
    redirect("/reports", RedirectType.replace);
  }

  const queryClient = new QueryClient();
  await usePrefetchReport(queryClient, parseInt(id));

  return (
    <>
      <section className={`${styles.reportSection} ${GeistSans.className}`}>
        <Sidebar />
        <div className={styles.reportContainer}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Header />
            <Session id={parseInt(id)} />
          </HydrationBoundary>
        </div>
      </section>
    </>
  );
}
