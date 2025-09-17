import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./style.less";

import { DEAL_LINK, DEALS_LINK, HOME_LINK } from "../../../static/static.ts";

import NotFound from "../../pages/NotFound";
import Home from "../../pages/Home";
import Deal from "../../pages/Deal";
import Deals from "../../pages/Deals";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={HOME_LINK} element={<Home />} />
        <Route path={DEAL_LINK} element={<Deal />} />
        <Route path={DEALS_LINK} element={<Deals />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
