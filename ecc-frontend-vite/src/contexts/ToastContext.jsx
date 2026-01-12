import { createContext, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  // toast = { message, type }

  function showToast(message, type = "info") {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  }

  function clearToast() {
    setToast(null);
  }

  return (
    <ToastContext.Provider
      value={{
        toast,
        showToast,
        clearToast
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
