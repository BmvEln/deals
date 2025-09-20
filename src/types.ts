import type { DEAL_STATUS_KEYS } from "./static/deals.ts";

export type CommentPT = { id: number; text: string };

export type DealPT = {
  id: number;
  name: string;
  status: keyof typeof DEAL_STATUS_KEYS;
  phone: string | undefined;
  budget: string | undefined;
  fullName: string | undefined;
  createdAt: string;
  comments: CommentPT[];
};
