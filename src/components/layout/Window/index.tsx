import React from "react";
import classNames from "classnames";

import "./style.less";

type Props = {
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  style?: object;
  className?: string;
};

function Window({ open, onClose, children, className, style }: Props) {
  return (
    <div
      className={classNames("Window", className, {
        active: open,
      })}
      onClick={onClose}
    >
      <div
        className={classNames("Window__content", { active: open })}
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default Window;
