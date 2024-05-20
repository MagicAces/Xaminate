"use client";

import { closeModal } from "@/redux/slices/modalSlice";
import { ModalContextType, ModalProviderProps, ModalState } from "@/types";
import React, { createContext, useContext, useState } from "react";
import { useDispatch } from "react-redux";

export const LoadingContext = createContext(null);
export const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [modalState, setModalState] = useState<ModalState>({
    id: 0,
    mode: 0,
    type: "",
  });

  const setId = (id: number) => {
    setModalState((prevState) => ({
      ...prevState,
      id,
    }));
  };

  const setType = (type: string) => {
    setModalState((prevState) => ({
      ...prevState,
      type,
    }));
  };

  const setMode = (mode: number) => {
    setModalState((prevState) => ({
      ...prevState,
      mode,
    }));
  };

  const setState = (id: number, mode: number, type: string) => {
    setModalState({
      id,
      mode,
      type,
    });
  };

  const exitModal = () => {
    dispatch(closeModal());
    setModalState({
      id: 0,
      mode: 0,
      type: "",
    });
  };

  const contextValue: ModalContextType = {
    modalState,
    setState,
    setType,
    setId,
    setMode,
    exitModal,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");

  return context;
};
