import "./style.less";

import Page from "../../layout/Page/index.js";
import { Link } from "react-router-dom";
import { DEAL_LINK, DEALS_LINK } from "../../../static/static.ts";

function Home() {
  return (
    <Page className="Home">
      <Link to={DEAL_LINK}>Deal</Link>
      <Link to={DEALS_LINK}>Deals</Link>
    </Page>
  );
}

export default Home;
