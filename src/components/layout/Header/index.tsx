import type { ReactNode } from "react";

import "./style.less";

function Header({ children }: { children: ReactNode }) {
  return (
    <div className="Header">
      <div className="HeaderContent">{children}</div>
    </div>
  );
}

export default Header;
