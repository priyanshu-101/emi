// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Reset some basic styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Apply a default font and background color */
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f0f0f0;
    color: #333;
    line-height: 1.6;
  }

  /* Styling for the main container of the app */
  #root {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  /* Basic link styling */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* Button default styles */
  button {
    cursor: pointer;
    font-family: inherit;
  }

  /* Input field styling */
  input {
    font-family: inherit;
  }
`;

export default GlobalStyles;
