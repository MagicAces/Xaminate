import logoCube from "@/public/images/logo_cube.gif";
import Image from "next/image";

const Spinner = () => {
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
      <Image src={logoCube} alt="Loading" />
    </div>
  );
}

export default Spinner;
