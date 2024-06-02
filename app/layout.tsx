import type { Metadata } from "next";
import "../styles/globals.scss";
import AllProviders from "@/lib/provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
// import "@radix-ui/themes/styles.css";
import { GeistSans } from "geist/font/sans";
import { Theme } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: {
    template: "Xaminate | %s",
    default: "Xaminate",
  },
  description: "An Advanced Intelligent Exam Monitoring System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className={GeistSans.className}>
        <AllProviders>
            <Theme appearance="dark">
                {children}
            </Theme>
        </AllProviders>
        <ToastContainer
          stacked
          position="bottom-right"
          closeOnClick
          theme="dark"
          pauseOnFocusLoss={false}
        />
      </body>
    </html>
  );
}
