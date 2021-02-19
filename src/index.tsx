import { render } from "react-dom";
import App from "./App";
import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";

const GlobalStyle = createGlobalStyle`
${normalize}
body {
  font-family: "Roboto" sans-serif;
  font-size: 24px;
}
`;

render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById("root")
);
