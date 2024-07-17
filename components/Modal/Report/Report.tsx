"use client";

import View from "./View";
import Student from "./Student";
import { useModal } from "@/utils/context";

const Report = () => {
  const { modalState } = useModal();

  return (
    <>
      {modalState.mode === 1 && <View />}
      {modalState.mode === 2 && <Student />}
    </>
  );
};

export default Report;
