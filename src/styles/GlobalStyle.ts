import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* Reset CSS */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Body styles */
  body {
    font-family: 'Inter', sans-serif;
    background-color: #f5f7fa;
    color: #333;
    min-height: 100vh;
  }

  /* Links */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Buttons reset */
  button {
    all: unset;
    cursor: pointer;
  }

  /* Inputs reset */
  input, select, textarea {
    font-family: inherit;
    font-size: 1rem;
  }
`;

export default GlobalStyle;
