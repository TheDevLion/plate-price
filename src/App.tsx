import { HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { PlatePricePage } from "./pages/PlatePricePage";
import { RestoreFromURL } from "./design_system/RestoreFromUrl";

export default function App() {

  return (
    <HashRouter basename="/">
      <RestoreFromURL />

      <Routes>
        <Route element={<Layout />}>
          <Route index element={<PlatePricePage />} />
          <Route path="*" element={<PlatePricePage />} />
        </Route>
      </Routes>

    </HashRouter>
  );
}
