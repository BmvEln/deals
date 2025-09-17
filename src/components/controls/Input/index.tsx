import React, { useRef } from "react";

import "./style.less";

type Props = {
  value: string;
  onChange: (e: string) => void;
  placeholder?: string;
  type?: string;
  style?: object;
  autoFocus?: boolean;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

function Input({
  placeholder,
  type,
  value,
  onChange,
  style,
  autoFocus,
  className,
  onKeyDown,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={"Input " + (className || "")}>
      <input
        style={style}
        ref={inputRef}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        disabled={false}
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

export default Input;
