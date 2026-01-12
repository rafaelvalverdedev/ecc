import { createContext, useContext, useState } from "react";

const LoaderContext = createContext(null);

export function LoaderProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  function showLoader() {
    setIsLoading(true);
  }

  function hideLoader() {
    setIsLoading(false);
  }

  async function withLoader(fn) {
    try {
      showLoader();
      return await fn();
    } finally {
      hideLoader();
    }
  }

  return (
    <LoaderContext.Provider
      value={{
        isLoading,
        showLoader,
        hideLoader,
        withLoader
      }}
    >
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
}
