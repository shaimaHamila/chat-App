import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/typography/headings.scss";
import "./styles/colors/colors.scss";
import "./main.scss";
import { ConfigProvider } from "antd";
import { antdThemeConfig } from "./styles/antdThemeConfig/antdThemeConfig.ts";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={antdThemeConfig}>
        <App />
      </ConfigProvider>
    </Provider>
  </StrictMode>,
);
