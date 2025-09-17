import React, {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store.tsx";

import type { DealPT } from "../../../types.ts";
import {
  DEAL_STATUSES_CONFIG,
  DEAL_STATUSES_LIST,
} from "../../../static/deals.ts";
import {
  addCommentDeal,
  updateDeal,
} from "../../../redux/slices/dealsSlice.tsx";

import "./style.less";

import Header from "../../layout/Header";
import Input from "../../controls/Input";
import Select from "../../controls/Select";
import Button from "../../controls/Button";

import NotFound from "../NotFound";

type InputBlockDataType = {
  fieldName: keyof DealPT;
  title: string;
  isSelect?: boolean;
  unit?: string;
};

type InputBlock = {
  title: string;
  isSelect?: boolean;
  value: number | string | string[];
  onChange: (fieldName: keyof DealPT, newValue: any) => void;
  fieldName: keyof DealPT;
  unit?: string | undefined;
  isEdit: boolean;
  onToggleEdit: () => void;
};

function InputBlock({
  title,
  isSelect,
  value,
  fieldName,
  onChange,
  unit,
  isEdit,
  onToggleEdit,
}: InputBlock) {
  const changeField = useCallback(
    (v: string | number) => {
      onChange(fieldName, v);
    },
    [onChange, fieldName],
  );

  const fillMethod = isSelect ? (
    <Select
      variants={DEAL_STATUSES_LIST.map(({ id, name }) => ({
        id,
        name,
      }))}
      curIdx={DEAL_STATUSES_LIST.findIndex((s) => s.id === value)}
      onChange={(v: string | number | undefined) => {
        if (v !== undefined) {
          changeField(v);
        }
      }}
      withoutNoSelected
      style={{ width: "100%" }}
    />
  ) : (
    <Input
      style={{ height: "48px" }}
      value={String(value || "")}
      onChange={(v: string) => changeField(v)}
      autoFocus
    />
  );

  return (
    <div className="DealInputBlock">
      <div>
        <div>{title}</div>
        <div onClick={onToggleEdit}>{isEdit ? "Отменить" : "Изменить"}</div>
      </div>

      {isEdit ? (
        fillMethod
      ) : (
        <div>
          {isSelect && typeof value === "string"
            ? DEAL_STATUSES_CONFIG[value].name
            : unit && value
              ? `${value} ${unit}`
              : value}
        </div>
      )}
    </div>
  );
}

function Deal() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { deals } = useAppSelector((state) => state.deals),
    deal = deals.find((deal: DealPT) => id === String(deal.id));

  const [dealFormData, setDealFormData] = useState(deal),
    originalDealRef = useRef(deal);

  const [editStates, setEditStates] = useState<Record<string, boolean>>({});
  const [comment, setComment] = useState("");
  const dealCommentsContentRef = useRef<HTMLDivElement>(null);

  const INPUT_BLOCK_DATA: InputBlockDataType[] = [
    { title: "Статус", fieldName: "status", isSelect: true },
    { title: "Номер телефона", fieldName: "phone" },
    { title: "Бюджет", fieldName: "budget", unit: "руб." },
    { title: "ФИО", fieldName: "fullName" },
    { title: "Дата создания", fieldName: "createdAt" },
  ];

  const toggleEdit = useCallback((fieldName: string) => {
    setEditStates((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  }, []);

  const addComment = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && comment.trim()) {
        dispatch(
          addCommentDeal({ dealId: Number(id), comment: comment.trim() }),
        );
      }
    },
    [comment],
  );

  const changeField = useCallback((field: keyof DealPT, newValue: any) => {
    setDealFormData((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        [field]: newValue || undefined,
      };
    });
  }, []);

  const saveDeal = useCallback(() => {
    if (dealFormData) dispatch(updateDeal(dealFormData));
  }, [dealFormData]);

  const cancelUpdate = useCallback(() => {
    setDealFormData(originalDealRef.current);
    setEditStates({});
  }, []);

  const isFieldChanges = useMemo(() => {
    if (!dealFormData || !originalDealRef.current) {
      return false;
    }

    for (const key in originalDealRef.current) {
      const typedKey = key as keyof DealPT;

      if (dealFormData[typedKey] !== originalDealRef.current[typedKey]) {
        return true;
      }
    }

    return false;
  }, [dealFormData]);

  useEffect(() => {
    if (dealCommentsContentRef.current) {
      if (dealCommentsContentRef.current.clientHeight > 383) {
        dealCommentsContentRef.current.classList.add("scroll");
      } else {
        dealCommentsContentRef.current.classList.remove("scroll");
      }
    }
  }, [deal]);

  if (!deal || !dealFormData) {
    return <NotFound />;
  }

  return (
    <>
      <Header>{deal.name}</Header>

      <div className="Deal">
        <div className="DealContent">
          <div className="DealHeading">{deal.name}</div>

          <div className="DealStatus">
            <div>Статус</div>
            <div
              style={{
                ...({
                  "--value":
                    DEAL_STATUSES_CONFIG[deal.status].progressValue * 100 + "%",
                } as CSSProperties),
                ...({
                  "--progressColor": DEAL_STATUSES_CONFIG[deal.status].color,
                } as CSSProperties),
              }}
            />

            <div>
              <div
                style={{
                  width:
                    DEAL_STATUSES_CONFIG[deal.status].progressValue * 100 + "%",
                }}
              >
                {DEAL_STATUSES_CONFIG[deal.status].name}
              </div>
            </div>
          </div>

          <div className="DealDivision">
            <div>
              {INPUT_BLOCK_DATA.map(({ title, fieldName, unit, isSelect }) => (
                <InputBlock
                  key={fieldName}
                  title={title}
                  isSelect={isSelect}
                  unit={unit}
                  fieldName={fieldName}
                  isEdit={!!editStates[fieldName]} // преобразуем undefined в false
                  onToggleEdit={() => toggleEdit(fieldName)}
                  value={dealFormData[fieldName as keyof DealPT] || ""}
                  onChange={changeField}
                />
              ))}
            </div>
            <div>
              <div className="DealComment">
                <div>Комментарий</div>
                npm run build
                <Input
                  className="white"
                  value={comment}
                  onChange={(v) => setComment(v)}
                  placeholder="Введите комментарий"
                  onKeyDown={addComment}
                />
              </div>
              <div className="DealComments">
                <div
                  className="DealCommentsContent"
                  ref={dealCommentsContentRef}
                >
                  {!deal.comments.length ? (
                    <div
                      style={{ fontSize: "24px", lineHeight: "100%" }}
                      className="notContent"
                    >
                      Комментария не добавлены
                    </div>
                  ) : (
                    deal.comments.map((comment: string, i: number) => (
                      <div key={i}>{comment}</div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {!isFieldChanges ? null : (
            <div className="DealBtns">
              <Button
                className="black"
                style={{ width: "290px" }}
                onClick={saveDeal}
              >
                Сохранить
              </Button>
              <Button
                className="gray"
                style={{ width: "280px" }}
                onClick={cancelUpdate}
              >
                Отмена
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Deal;
