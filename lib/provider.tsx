// In Next.js, this file would be called: app/providers.jsx
"use client";

// We can not useState or useRef in a server component, which is why we are
// extracting this part out into it's own file with 'use client' on top
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider, useSession } from "next-auth/react";
import Providers from "@/redux/Providers";
import { ModalProvider } from "@/utils/context";

export default function AllProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 4 * 1000,
            refetchInterval: 4 * 1000,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <Providers>
        <QueryClientProvider client={queryClient}>
          <ModalProvider>{children}</ModalProvider>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </Providers>
    </SessionProvider>
  );
}
