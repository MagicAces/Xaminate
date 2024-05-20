import Form from "@/components/Login/Form";
import styles from "@/styles/login.module.scss";
import { Metadata } from "next";
import Starfield from "react-starfield";

export const metadata: Metadata = {
  title: "Login",
};

export default async function Login() {
  return (
    <>
      <Starfield
        starCount={2000}
        starColor={[56, 142, 60]}
        speedFactor={0.5}
        backgroundColor="black"
      />
      <div className={styles.formContainer}>
        <Form />
      </div>
    </>
  );
}
