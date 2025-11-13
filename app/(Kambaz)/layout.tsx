"use client";

import { ReactNode } from "react";
import KambazNavigation from "./Navigation";
import "./styles.css";
import store from "./store";
import { Provider } from "react-redux";
import Session from "./Account/Session";

export default function KambazLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Provider store={store}>
      <Session>
        <div>
          <KambazNavigation />
          <div style={{ marginLeft: "120px" }} className="p-3">
            {children}
          </div>
      </div>
      </Session>
    </Provider>
  );
}