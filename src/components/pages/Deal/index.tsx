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
import { updateDeal } from "../../../redux/slices/dealsSlice.tsx";

import Header from "../../layout/Header";
import Input from "../../controls/Input";
import Select from "../../controls/Select";
import Button from "../../controls/Button";
import NotFound from "../NotFound";
import { formatPhoneNumber } from "../../../functions.ts";

// <editor-fold desc="Типы и константы">
type InputBlockDataProps = {
  fieldName: keyof DealPT;
  title: string;
  isSelect?: boolean;
  unit?: string;
  noEdit?: boolean;
};

const INPUT_BLOCK_DATA: InputBlockDataProps[] = [
  { title: "Статус", fieldName: "status", isSelect: true },
  {
    title: "Номер телефона",
    fieldName: "phone",
  },
  { title: "Бюджет", fieldName: "budget", unit: "руб." },
  { title: "ФИО", fieldName: "fullName" },
  { title: "Дата создания", fieldName: "createdAt", noEdit: true },
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
  noEdit?: boolean;
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
  noEdit,
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
      onChange={(v: string) => {
        if (fieldName === "phone") {
          changeField(formatPhoneNumber(v));
          return;
        }

        changeField(v);
      }}
      autoFocus
    />
  );

  return (
    <div className="DealInputBlock">
      <div>
        <div>{title}</div>
        {noEdit ? null : (
          <div onClick={onToggleEdit}>{isEdit ? "Отменить" : "Изменить"}</div>
        )}
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
  comments: string[] | [];
};

function Comments({
  state,
  setState,
  addComment,
  dealCommentsContentRef,
  comments,
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
          {!comments.length ? (
            <div
              style={{ fontSize: "24px", lineHeight: "130%" }}
              className="notContent"
            >
              Комментария не добавлены
            </div>
          ) : (
            comments.map((comment: string, i: number) => (
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

  const [dealFormData, setDealFormData] = useState(deal);

  const [editStates, setEditStates] = useState<Record<string, boolean>>({});
  const [comment, setComment] = useState("");
  const dealCommentsContentRef = useRef<HTMLDivElement>(null);

  const isFieldChanges = useMemo(() => {
    if (!dealFormData || !deal) return false;

    return JSON.stringify(dealFormData) !== JSON.stringify(deal);
  }, [dealFormData, deal]);

  const toggleEdit = useCallback(
    (fieldName: keyof DealPT) => {
      // Если поле было в режиме редактирования, сбрасываем его значение
      if (editStates[fieldName]) {
        setDealFormData((prev) => {
          if (!prev || !deal) return prev;

          return {
            ...prev,
            [fieldName]: deal[fieldName],
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
        setDealFormData((prev: DealPT | undefined) => {
          if (!prev) return prev;

          return {
            ...prev,
            comments: [...(prev.comments || []), comment],
          };
        });
        setComment("");
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
      setEditStates({});
    }
  }, [dealFormData]);

  const cancelUpdate = useCallback(() => {
    setDealFormData(deal);
    setEditStates({});
  }, []);

  useEffect(() => {
    setDealFormData(deal);
  }, [deal]);

  useEffect(() => {
    const commentsEl = dealCommentsContentRef.current;

    if (commentsEl) {
      const hasScroll = commentsEl.scrollHeight > commentsEl.clientHeight;
      commentsEl.classList.toggle("scroll", hasScroll);
    }
  }, [dealFormData?.comments]);

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
              {INPUT_BLOCK_DATA.map(
                ({ title, fieldName, unit, isSelect, noEdit }) => (
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
                    noEdit={noEdit}
                  />
                ),
              )}
            </div>

            <Comments
              state={comment}
              setState={setComment}
              addComment={addComment}
              dealCommentsContentRef={dealCommentsContentRef}
              comments={dealFormData.comments}
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
