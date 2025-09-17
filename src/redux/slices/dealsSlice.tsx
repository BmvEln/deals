import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DealPT } from "../../types.ts";

const initialState: { deals: DealPT[] } = {
  deals: [
    {
      id: 1,
      status: "new",
      name: "Название сделки",
      phone: undefined,
      budget: undefined,
      fullName: undefined,
      createdAt: "01.02.2024",
      comments: [
        "Текст комментария",
        "Текст комментария",
        "Текст комментария",
        "Текст комментария",
        "Текст комментария",
        "Текст комментария",
      ],
    },
    {
      id: 2,
      status: "success",
      name: "Название сделки Название сделки",
      phone: undefined,
      budget: undefined,
      fullName: undefined,
      createdAt: "01.02.2024",
      comments: [],
    },
  ],
};

export const dealsSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {
    addDeal: (state, action: PayloadAction<DealPT>) => {
      if (!state.deals.some((a) => a.id === action.payload.id)) {
        state.deals.push(action.payload);
      }
    },
    setDeals: (state, action: PayloadAction<DealPT[]>) => {
      state.deals = action.payload;
    },
    addCommentDeal: (
      state,
      action: PayloadAction<{ dealId: number; comment: string }>,
    ) => {
      const { dealId, comment } = action.payload;

      const deal = state.deals.find((deal: DealPT) => deal.id === dealId);

      if (deal) {
        deal.comments.push(comment);
      }
    },
    updateDeal: (state, action: PayloadAction<DealPT>) => {
      const dealIdx = state.deals.findIndex(
        (deal: DealPT) => deal.id === action.payload.id,
      );

      if (dealIdx !== -1) {
        state.deals[dealIdx] = action.payload;
      }
    },
  },
});

export const { setDeals, addDeal, addCommentDeal, updateDeal } =
  dealsSlice.actions;
export default dealsSlice.reducer;
