import { motion } from "framer-motion";
import React from "react";

interface PageTransitionProps {
  children: React.ReactNode;
  isForm?: boolean;
  className?: string;
  from?: "login" | "register";
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  isForm = false,
  className = "",
  from,
}) => {
  const variants = {
    initial: {
      opacity: 0,
      x: isForm
        ? from === "register"
          ? -100
          : 100
        : from === "register"
        ? 100
        : -100,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] },
    },
    exit: {
      opacity: 0,
      x: isForm
        ? from === "register"
          ? 100
          : -100
        : from === "register"
        ? -100
        : 100,
      transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};
