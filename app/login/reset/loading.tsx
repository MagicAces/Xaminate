import logoCube from "@/public/images/logo_cube.gif";
import Image from "next/image";

export default function Loading() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image src={logoCube} alt="Loading" 
            priority={true}/>
    </div>
  );
}
