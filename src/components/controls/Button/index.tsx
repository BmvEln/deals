import React from "react";
import classNames from "classnames";

import "./style.less";

type Props = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  style?: object;
  className?: string;
  selected?: boolean;
  disabled?: boolean;
  title?: string;
};

function Button({
  onClick = () => {},
  children,
  style,
  className,
  selected,
  disabled,
  title,
}: Props) {
  return (
    <button
      title={title}
      className={classNames("Button", className, {
        selected,
        disabled,
      })}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
