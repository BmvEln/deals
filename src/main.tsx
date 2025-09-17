import { StrictMode } from "react";
import { store } from "./redux/store.tsx";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";

import App from "./components/layout/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
