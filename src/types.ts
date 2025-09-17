import type { DEAL_STATUS_KEYS } from "./static/deals.ts";

export type DealPT = {
  id: number;
  name: string;
  status: (typeof DEAL_STATUS_KEYS)[keyof typeof DEAL_STATUS_KEYS];
  phone: string | undefined;
  budget: string | undefined;
  fullName: string | undefined;
  createdAt: string;
  comments: string[];
};
