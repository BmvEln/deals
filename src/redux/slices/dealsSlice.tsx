import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DealPT } from "../../types.ts";

const initialState: { deals: DealPT[] } = {
  deals: [
    {
      id: 1,
      status: "NEW",
      name: "Название сделки",
      phone: undefined,
      budget: undefined,
      fullName: undefined,
      createdAt: "01.02.2024",
      comments: [{ id: 1, text: "Текст комментария" }],
    },
    {
      id: 2,
      status: "SUCCESS",
      name: "Название сделки",
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
    removeDeal: (state, action: PayloadAction<number>) => {
      state.deals = state.deals.filter((deal) => deal.id !== action.payload);
    },
    addDeal: (state, action: PayloadAction<DealPT>) => {
      if (!state.deals.some((a) => a.id === action.payload.id)) {
        state.deals.push(action.payload);
      }
    },
    setDeals: (state, action: PayloadAction<DealPT[]>) => {
      state.deals = action.payload;
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

export const { setDeals, addDeal, updateDeal, removeDeal } = dealsSlice.actions;
export default dealsSlice.reducer;
