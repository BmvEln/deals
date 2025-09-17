import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./style.less";

import { DEAL_LINK, DEALS_LINK } from "../../../static/static.ts";

import NotFound from "../../pages/NotFound";
import Deal from "../../pages/Deal";
import Deals from "../../pages/Deals";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={DEALS_LINK} replace />} />
        <Route path={DEALS_LINK} element={<Deals />} />
        <Route path={DEAL_LINK} element={<Deal />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
