"use client"

import { createContext, useState, useContext } from 'react';

const Context = createContext();

export function useYourContext() {
  return useContext(Context);
}

export function ContextProvider({ children }) {
  const [showLoadingBar, setShowLoadingBar] = useState(false);

  const yourFunction = () => {
    
  };

  return (
    <Context.Provider value={{ showLoadingBar, setShowLoadingBar }}>
      {children}
    </Context.Provider>
  );
}
