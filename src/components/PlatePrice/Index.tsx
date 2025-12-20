import { PlatePriceHeader } from "./PlatePriceHeader";
import { PlatePriceContent } from "./PlatePriceContent";
import { useEffect } from "react";
import { useDatasheets } from "./store";
import { STORE_APP_KEYS } from "../../constants";

export const PlatePrice = () => {
  const {setDatasheets} = useDatasheets()
  
  useEffect(() => {
    const receipts = localStorage.getItem(STORE_APP_KEYS.receipts);
    if (receipts) setDatasheets(JSON.parse(receipts));
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <PlatePriceHeader />
      <PlatePriceContent />
    </div>
  );
};
