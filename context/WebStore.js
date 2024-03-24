import { createContext, useState, useContext } from 'react';
import LoadingBar from "react-top-loading-bar";

const context = createContext();

export function useWebStore() {
  return useContext(context);
}

function ContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0);

  const yourFunction = () => {
    
  };

  return (
    <context.Provider value={{ progress, setProgress, isLoading, setIsLoading }}>     
    {isLoading && <LoadingSpinner />}     
    <LoadingBar
      color="rgba(199, 148, 59, 0.8)"
      progress={progress}
      onLoaderFinished={() => setProgress(0)}
    />
      {children}
    </context.Provider>
  );
}

export { context, ContextProvider };