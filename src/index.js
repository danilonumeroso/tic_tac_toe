import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { value_iteration, extract_policy } from './value_iteration'
import App from "./App";

const pi = extract_policy(value_iteration())
const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <App agent={pi}/>
  </StrictMode>
);
