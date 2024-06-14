"use client"

import Create from "./Create";
import Filters from "./Filters";
import Edit from "./Edit";
import { useModal } from "@/utils/context";
import End from "./End";

const Session = () => {
    const { modalState } = useModal();

    return (
      <>
        {modalState.mode === 1 && <Create />}
        {modalState.mode === 2 && <Filters />}
        {modalState.mode === 3 && <Edit />}
        {modalState.mode === 4 && <End />}
      </>
    );
};

export default Session;