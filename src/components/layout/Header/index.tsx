import "./style.less";
import type { ReactNode } from "react";

function Header({ children }: { children: ReactNode }) {
  return (
    <div className="Header">
      <div className="HeaderContent">{children}</div>
    </div>
  );
}

export default Header;
