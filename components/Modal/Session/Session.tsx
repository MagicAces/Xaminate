"use client"

import Create from "./Create";
import Filters from "./Filters";
import { useModal } from "@/utils/context";

const Session = () => {
    const { modalState } = useModal();

    return (
        <>
            {modalState.mode === 1 && <Create />}
            {modalState.mode === 2 && <Filters />}
        </>
    );
};

export default Session;