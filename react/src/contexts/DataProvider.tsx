import { useState } from "react";
import type { ReactNode } from "react";
import { getTemplateData } from "../utils/common";
import { DoesDataExistContext } from "./context";

export function DataProvider({ children }: { children: ReactNode }) {
  const [doesDataExist, setDoesDataExist] = useState<number>(
    getTemplateData().size
  );
  return (
    <DoesDataExistContext.Provider value={{ doesDataExist, setDoesDataExist }}>
      {children}
    </DoesDataExistContext.Provider>
  );
}
