"use client";

import { createContext, useContext, ReactNode } from "react";
import { ServiceSearchResult } from "~/types/service";

interface ServicesContextType {
  services: ServiceSearchResult[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const ServicesContext = createContext<ServicesContextType | undefined>(
  undefined
);

export function ServicesProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: ServicesContextType;
}) {
  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error("useServices must be used within a ServicesProvider");
  }
  return context;
}
