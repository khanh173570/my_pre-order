import { useContext } from "react";
import { PreOrderContext } from "../context/PreOrderContext";

export const usePreOrder = () => {
  const context = useContext(PreOrderContext);
  if (!context) {
    throw new Error("usePreOrder must be used within a PreOrderProvider");
  }
  return context;
};
