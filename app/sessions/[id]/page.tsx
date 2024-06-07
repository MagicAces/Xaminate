import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Session from "@/components/Session/Session";
import styles from "@/styles/session.module.scss";
import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";

import { usePrefetchSession } from "@/server/hooks/prefetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "Sessions",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!isFinite(parseInt(id)) || parseInt(id) < 1) {
    redirect("/sessions", RedirectType.replace);
  }

  const queryClient = new QueryClient();
  await usePrefetchSession(queryClient, parseInt(id));

  return (
    <>
      <section className={`${styles.sessionSection} ${GeistSans.className}`}>
        <Sidebar />
        <div className={styles.sessionContainer}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Header />
            <Session id={parseInt(id)} />
          </HydrationBoundary>
        </div>
      </section>
    </>
  );
}
