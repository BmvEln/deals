import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store.tsx";

import "./style.less";

import type { DealPT } from "../../../types.ts";
import {
  DEAL_STATUS_KEYS,
  DEAL_STATUSES_CONFIG,
  DEAL_STATUSES_LIST,
} from "../../../static/deals.ts";
import {
  addCommentDeal,
  updateDeal,
} from "../../../redux/slices/dealsSlice.tsx";

import Header from "../../layout/Header";
import Input from "../../controls/Input";
import Select from "../../controls/Select";
import Button from "../../controls/Button";
import NotFound from "../NotFound";

// <editor-fold desc="Типы и константы">
type InputBlockDataProps = {
  fieldName: keyof DealPT;
  title: string;
  isSelect?: boolean;
  unit?: string;
};

const INPUT_BLOCK_DATA: InputBlockDataProps[] = [
  { title: "Статус", fieldName: "status", isSelect: true },
  { title: "Номер телефона", fieldName: "phone" },
  { title: "Бюджет", fieldName: "budget", unit: "руб." },
  { title: "ФИО", fieldName: "fullName" },
  { title: "Дата создания", fieldName: "createdAt" },
];
// </editor-fold>

// <editor-fold desc="Компоненты">
type InputBlockProps = {
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
}: InputBlockProps) {
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

type CommentsProps = {
  state: string;
  setState: (state: string) => void;
  addComment: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  dealCommentsContentRef: React.Ref<HTMLDivElement>;
  deal: DealPT;
};

function Comments({
  state,
  setState,
  addComment,
  dealCommentsContentRef,
  deal,
}: CommentsProps) {
  return (
    <div>
      <div className="DealComment">
        <div>Комментарий</div>

        <Input
          className="white"
          value={state}
          onChange={(v) => setState(v)}
          placeholder="Введите комментарий"
          onKeyDown={addComment}
        />
      </div>
      <div className="DealComments">
        <div className="DealCommentsContent" ref={dealCommentsContentRef}>
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
  );
}

type StatusBlockProps = {
  status: keyof typeof DEAL_STATUS_KEYS;
};

function StatusBlock({ status }: StatusBlockProps) {
  return (
    <div className="DealStatus">
      <div>Статус</div>
      <div
        style={{
          ...({
            "--value": DEAL_STATUSES_CONFIG[status].progressValue * 100 + "%",
          } as React.CSSProperties),
          ...({
            "--progressColor": DEAL_STATUSES_CONFIG[status].color,
          } as React.CSSProperties),
        }}
      />

      <div>
        <div
          style={{
            width: DEAL_STATUSES_CONFIG[status].progressValue * 100 + "%",
          }}
        >
          {DEAL_STATUSES_CONFIG[status].name}
        </div>
      </div>
    </div>
  );
}
// </editor-fold>

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

  const toggleEdit = useCallback(
    (fieldName: keyof DealPT) => {
      // Если поле было в режиме редактирования, сбрасываем его значение
      if (editStates[fieldName]) {
        setDealFormData((prev) => {
          if (!prev || !originalDealRef.current) return prev;

          return {
            ...prev,
            [fieldName]: originalDealRef.current[fieldName],
          };
        });
      }

      setEditStates((prev) => ({
        ...prev,
        [fieldName]: !prev[fieldName],
      }));
    },
    [editStates],
  );

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
    if (dealFormData) {
      dispatch(updateDeal(dealFormData));
      originalDealRef.current = dealFormData;
      setEditStates({});
    }
  }, [dealFormData]);

  const cancelUpdate = useCallback(() => {
    setDealFormData(originalDealRef.current);
    setEditStates({});
  }, []);

  const isFieldChanges = useMemo(() => {
    if (!dealFormData || !originalDealRef.current) return false;

    const originalDeal = originalDealRef.current,
      keys = Object.keys(originalDeal) as Array<keyof DealPT>;

    return keys.some((key) => dealFormData[key] !== originalDeal[key]);
  }, [dealFormData, deal]);

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

          <StatusBlock status={deal.status} />

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

            <Comments
              state={comment}
              setState={setComment}
              addComment={addComment}
              dealCommentsContentRef={dealCommentsContentRef}
              deal={deal}
            />
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
