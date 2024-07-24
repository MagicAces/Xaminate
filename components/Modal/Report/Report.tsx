"use client";

import View from "./View";
import Student from "./Student";
import { useModal } from "@/utils/context";
import Action from "./Action";
import Comment from "./Comment";

const Report = () => {
  const { modalState } = useModal();

  return (
    <>
      {modalState.mode === 1 && <View />}
      {modalState.mode === 2 && <Student />}
      {modalState.mode === 3 && <Action />}
      {modalState.mode === 4 && <Action />}
      {modalState.mode === 5 && <Comment />}
    </>
  );
};

export default Report;
