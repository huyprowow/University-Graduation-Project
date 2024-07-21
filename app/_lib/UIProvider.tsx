"use client";
import { createTheme, ThemeProvider } from "@mui/material";
import { NextUIProvider } from "@nextui-org/react";
import React from "react";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
const UIProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextUIProvider>
      <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
    </NextUIProvider>
  );
};

export default UIProvider;
