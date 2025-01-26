import React from "react";

export function useAntdMessage() {
  return React.useContext(AntdMessageContext);
}

export const AntdMessageContext = React.createContext();
