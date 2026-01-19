import { createSlice } from "@reduxjs/toolkit";

export const defaultLayout = [
  { x: 0, y: 0, w: 12, h: 4, i: "hero" },

  { x: 0, y: 4, w: 4, h: 1, i: "students-card" },
  { x: 4, y: 4, w: 4, h: 1, i: "semesters-card" },
  { x: 8, y: 4, w: 4, h: 1, i: "courses-card" },

  { x: 0, y: 5, w: 6, h: 3, i: "testimonials-card" },
  { x: 6, y: 5, w: 6, h: 3, i: "upcoming-events-card" },

  { x: 0, y: 8, w: 12, h: 2, i: "past-events-card" },
];

const layoutSlice = createSlice({
  name: "layout",
  initialState: {
    landingPageLayout: defaultLayout,
  },
  reducers: {
    setLandingPageLayout(state, action) {
      state.landingPageLayout = action.payload;
    },
    resetLandingPageLayout(state) {
      state.landingPageLayout = defaultLayout;
    },
    // Set layout from login response (handles JSON string)
    setLayoutFromResponse(state, action) {
      const layoutData = action.payload;
      
      if (typeof layoutData === "string") {
        // Parse if it's a JSON string
        try {
          const parsed = JSON.parse(layoutData);
          state.landingPageLayout = parsed.landingPageLayout || defaultLayout;
        } catch {
          state.landingPageLayout = defaultLayout;
        }
      } else if (layoutData && layoutData.landingPageLayout) {
        // Use the parsed object directly
        state.landingPageLayout = layoutData.landingPageLayout;
      } else {
        state.landingPageLayout = defaultLayout;
      }
    },
  },
});

export const { setLandingPageLayout, resetLandingPageLayout, setLayoutFromResponse } =
  layoutSlice.actions;

export default layoutSlice.reducer;
