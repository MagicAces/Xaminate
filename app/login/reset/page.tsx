import Reset from "@/components/Reset/Reset";
import styles from "@/styles/reset.module.scss";
import { Metadata } from "next";
import Starfield from "react-starfield";

export const metadata: Metadata = {
  title: "Password Reset",
};

export default async function Forgot() {
  return (
    <>
      <Starfield
        starCount={2000}
        starColor={[56, 142, 60]}
        speedFactor={0.5}
        backgroundColor="black"
      />
      <div className={styles.resetContainer}>
        <Reset />
      </div>
    </>
  );
}
