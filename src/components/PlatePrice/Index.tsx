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
    <div className="bg-grape-50 sm:min-h-screen">
      <PlatePriceHeader />
      <PlatePriceContent />
    </div>
  );
};
