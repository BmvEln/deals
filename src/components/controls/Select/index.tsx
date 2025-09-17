import { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import "./style.less";

type SelectProps = {
  variants: { id: number | string; name: string }[];
  onChange?: (value: number | string | undefined) => void;
  style?: object;
  curIdx?: number | undefined;
  withoutNoSelected?: boolean;
};

function Select({
  variants = [{ id: 1, name: "" }],
  onChange,
  style,
  curIdx = undefined,
  withoutNoSelected = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false),
    [idxItem, setIdxItem] = useState<number | undefined>(curIdx),
    selectRef = useRef<HTMLDivElement>(null),
    handleClickOutside = useCallback(
      (e: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      },
      [selectRef],
    ),
    handleClickPoint = useCallback(
      (i: number, id: number | string, isNoSelected: boolean) => {
        setIdxItem(isNoSelected ? undefined : i);
        setIsOpen(false);

        if (onChange) {
          onChange(isNoSelected ? undefined : id);
        }
      },
      [onChange],
    );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, [handleClickOutside]);

  return (
    <div
      className="Select"
      ref={selectRef}
      style={style}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="Select__header">
        {typeof idxItem === "number" ? (
          variants[idxItem].name
        ) : (
          <span className="Select__notDefined">Не выбрано</span>
        )}
      </div>
      <div className={classNames("Select__popUp", { open: isOpen })}>
        {variants.map(({ id, name }, i) => {
          const pointerEvents = isOpen ? "auto" : "none";
          const pointLayout = (
            <div
              key={id}
              className="Select__point"
              style={{ pointerEvents }}
              onClick={() => handleClickPoint(i, id, false)}
            >
              <div>{name}</div>
            </div>
          );

          return !i ? (
            <>
              {withoutNoSelected ? null : (
                <div
                  key={`${id}-noSelected`}
                  className="Select__point"
                  style={{ pointerEvents }}
                  onClick={() => handleClickPoint(i, id, true)}
                >
                  <div>Не выбрано</div>
                </div>
              )}
              {pointLayout}
            </>
          ) : (
            pointLayout
          );
        })}
      </div>
    </div>
  );
}

export default Select;
