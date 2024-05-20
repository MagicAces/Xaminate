"use client";

import { useSelector } from "react-redux";
import Email from "./Email";
import OTP from "./OTP";
import Password from "./Password";
import Success from "./Success";

const Reset = () => {
  const { section } = useSelector((state: any) => state.reset);

  return (
    <>
      {section === 1 && <Email />}
      {section === 2 && <OTP />}
      {section === 3 && <Password />}
      {section === 4 && <Success />}
    </>
  );
};

export default Reset;
