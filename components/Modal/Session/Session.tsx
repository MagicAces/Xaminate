"use client"

import Create from "./Create";
import { useModal } from "@/utils/context";

const Session = () => {
    const { modalState } = useModal();

    return (
        <>
            {modalState.mode === 1 && <Create />}
        </>
    );
};

export default Session;