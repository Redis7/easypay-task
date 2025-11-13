import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TransactionsPage from "./pages/Transactions";
import AddTransactionPage from "./pages/AddTransaction";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<TransactionsPage />} />
          <Route path="/add" element={<AddTransactionPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;



