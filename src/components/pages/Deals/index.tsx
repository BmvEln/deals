import { Link } from "react-router-dom";
import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store.tsx";
import { addDeal } from "../../../redux/slices/dealsSlice.tsx";

import "./style.less";

import type { DealPT } from "../../../types.ts";
import {
  DEAL_STATUS_KEYS,
  DEAL_STATUSES_CONFIG,
} from "../../../static/deals.ts";

import { generateNewId } from "../../../functions.ts";

import Header from "../../layout/Header";
import Button from "../../controls/Button";
import Window from "../../layout/Window";
import Input from "../../controls/Input";

const COMPLETED_STATUSES = [DEAL_STATUS_KEYS.SUCCESS, DEAL_STATUS_KEYS.FAILED];

function Deals() {
  const dispatch = useAppDispatch();

  const [w, setW] = useState(false),
    [showAll, setShowAll] = useState(true),
    [dealName, setDealName] = useState(""),
    [error, setError] = useState(false);

  const { deals } = useAppSelector((state) => state.deals),
    filteredDeals = showAll
      ? deals.filter((deal) => {
          return !COMPLETED_STATUSES.some((status) => status === deal.status);
        })
      : deals.filter(
          (deal) =>
            deal.status === DEAL_STATUS_KEYS.SUCCESS ||
            deal.status === DEAL_STATUS_KEYS.FAILED,
        );

  const closeWindow = useCallback(() => {
    setW(false);
    setError(false);
    setDealName("");
  }, []);

  const saveDeal = useCallback(() => {
    if (!dealName) {
      setError(true);
      return;
    }

    const today = new Date(),
      formattedDate = new Intl.DateTimeFormat("ru-RU").format(today);

    dispatch(
      addDeal({
        id: generateNewId(deals),
        status: DEAL_STATUS_KEYS.NEW,
        name: dealName,
        phone: undefined,
        budget: undefined,
        fullName: undefined,
        createdAt: formattedDate,
        comments: [],
      }),
    );

    closeWindow();
  }, [dealName]);

  return (
    <>
      <Header>Список сделок</Header>

      <div className="Deals">
        <div className="DealsContent">
          <Button
            style={{ marginBottom: "42px", width: "368px" }}
            onClick={() => setW(true)}
          >
            Создать
          </Button>

          <div className="DealsTabs">
            <Button
              className={showAll ? "black" : undefined}
              style={{ width: "300px" }}
              onClick={() => setShowAll(true)}
            >
              Все
            </Button>
            <Button
              className={showAll ? undefined : "black"}
              style={{ width: "300px" }}
              onClick={() => setShowAll(false)}
            >
              Архив
            </Button>
          </div>

          {!filteredDeals.length ? (
            <div style={{ fontSize: "36px", lineHeight: "100%" }}>
              Сделки не добавлены
            </div>
          ) : (
            <div className="DealsTable">
              <div>
                <div>id</div>
                <div>Название</div>
                <div>Статус</div>
                <div>Дата создания</div>
              </div>

              {filteredDeals.map(({ id, name, status, createdAt }: DealPT) => (
                <Link key={id} to={`/deals/${id}`}>
                  <div>{id}</div>
                  <div>{name}</div>
                  <div>{DEAL_STATUSES_CONFIG[status].name}</div>
                  <div>{createdAt}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Window open={w} onClose={closeWindow}>
        <div className="DealsWindow">
          <div>Создать сделку</div>

          <div>название</div>

          <Input
            className={error ? "error" : undefined}
            value={dealName}
            onChange={(v: string) => {
              if (error) {
                setError(false);
              }

              setDealName(v);
            }}
            placeholder="Введите название"
          />

          <div>
            <Button
              className="black"
              style={{ width: "290px" }}
              onClick={saveDeal}
            >
              Создать
            </Button>
            <Button
              className="gray"
              style={{ width: "280px" }}
              onClick={closeWindow}
            >
              Отмена
            </Button>
          </div>
        </div>
      </Window>
    </>
  );
}

export default Deals;
