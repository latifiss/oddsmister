"use client";

import { Provider } from "react-redux";
import { store } from "./index";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "../styles/theme";
import { useSelector } from "react-redux";
import { RootState } from "./index";

function StyledThemeWrapper({ children }: { children: React.ReactNode }) {
  const theme = useSelector((state: RootState) => state.theme.theme);
  return (
    <StyledThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      {children}
    </StyledThemeProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StyledThemeWrapper>
        {children}
      </StyledThemeWrapper>
    </Provider>
  );
}