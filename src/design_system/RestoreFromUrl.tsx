import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QUERY_PARAM_KEY, PAGE_TO_REDIRECT, importLocalStorageFromURL } from "./RestoreFromUrlHelper";


// Just render componente in App.tsx root (inside the router)
export const RestoreFromURL = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      let encodedData = new URLSearchParams(location.search).get(QUERY_PARAM_KEY);

      if (!encodedData) {
        const rawHash = window.location.hash || "";
        const hashQueryIndex = rawHash.indexOf("?");
        if (hashQueryIndex >= 0) {
          const queryString = rawHash.slice(hashQueryIndex + 1);
          encodedData = new URLSearchParams(queryString).get(QUERY_PARAM_KEY);
        }
      }

      if (!encodedData) return;

      const importedData = importLocalStorageFromURL(encodedData);
      if (!importedData) return;

      // Redirect to page
      if (PAGE_TO_REDIRECT) {
        const currentPath = location.pathname || window.location.pathname || "";
        const onHashPath = window.location.hash.split("?")[0] || "";
        const isOnProperPage = currentPath.includes(PAGE_TO_REDIRECT) || onHashPath.includes(PAGE_TO_REDIRECT.replace("/",""));
  
        if (!isOnProperPage) {
          navigate(PAGE_TO_REDIRECT, { replace: true });
        }
      }

      // Clear URL
      const basePath = import.meta.env.BASE_URL || "/";
      const newHash = "#" + PAGE_TO_REDIRECT;
      const newUrl = basePath + newHash;
      window.history.replaceState(null, "", newUrl);
    } catch (err) {
      console.error("[RestoreFromURL] unexpected error:", err);
    }
  }, [location, navigate]);

  return null;
};
