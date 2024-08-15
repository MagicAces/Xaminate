import Link from "next/link";
import Image from "next/image";
import logoCube from "@/public/images/logo.png";

export default function NotFound() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <Image src={logoCube} alt="Loading" priority={true} />
      <h1>Not found – 404!</h1>
      <div>
        <Link style={{ color: "#4CAF50" }} href="/home">
          Go back to Home
        </Link>
      </div>
    </div>
  );
}
