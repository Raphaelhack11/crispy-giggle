import React from "react";
import { motion } from "framer-motion";

export default function Button({ className = "", children, as = "button", ...rest }) {
  const Comp = motion[as] || motion.button;
  return (
    <Comp
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`btn bg-brand-600 text-white hover:bg-brand-700 ${className}`}
      {...rest}
    >
      {children}
    </Comp>
  );
}
