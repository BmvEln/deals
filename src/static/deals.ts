export const DEAL_STATUS_KEYS = {
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS",
  ALMOST_DONE: "ALMOST_DONE",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
} as const;

export const DEAL_STATUSES_CONFIG: Record<
  string,
  { name: string; id: string; color: string; progressValue: number }
> = {
  [DEAL_STATUS_KEYS.NEW]: {
    id: DEAL_STATUS_KEYS.NEW,
    name: "Новый",
    color: "#D29A00",
    progressValue: 0.2,
  },
  [DEAL_STATUS_KEYS.IN_PROGRESS]: {
    id: DEAL_STATUS_KEYS.IN_PROGRESS,
    name: "В работе",
    color: "#CACA00",
    progressValue: 0.4,
  },
  [DEAL_STATUS_KEYS.ALMOST_DONE]: {
    id: DEAL_STATUS_KEYS.ALMOST_DONE,
    name: "Почти завершен",
    color: "#69D200",
    progressValue: 0.6,
  },
  [DEAL_STATUS_KEYS.SUCCESS]: {
    id: DEAL_STATUS_KEYS.SUCCESS,
    name: "Успешно",
    color: "#00C907",
    progressValue: 1,
  },
  [DEAL_STATUS_KEYS.FAILED]: {
    id: DEAL_STATUS_KEYS.FAILED,
    name: "Провал",
    color: "#ED0000",
    progressValue: 1,
  },
};

export const DEAL_STATUSES_LIST = Object.values(DEAL_STATUSES_CONFIG);
