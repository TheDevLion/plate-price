import { PlatePriceHeader } from "./header/PlatePriceHeader";
import { PlatePriceContent } from "./content/PlatePriceContent";
import { useEffect } from "react";
import { useDatasheets } from "./store";

export const PlatePrice = () => {
  const { loadDatasheets } = useDatasheets()
  
  useEffect(() => {
    loadDatasheets();
  }, [loadDatasheets])

  return (
    <div className="min-h-screen bg-grape-50">
      <PlatePriceHeader />
      <PlatePriceContent />
    </div>
  );
};
