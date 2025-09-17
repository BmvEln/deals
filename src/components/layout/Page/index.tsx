import React from "react";
import classNames from "classnames";

import "./style.less";

import Footer from "../Footer";

interface PageProps {
  className?: string;
  style?: object;
  children: React.ReactNode;
}

function Page({ children, style, className }: PageProps) {
  return (
    <div className={classNames("Page", className)} style={style}>
      <div className="PageContent">{children}</div>

      <Footer />
    </div>
  );
}

export default Page;
