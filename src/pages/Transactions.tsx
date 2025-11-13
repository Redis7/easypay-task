import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { Button, Dialog, DialogTitle, DialogContent,Typography  } from "@mui/material";
import AddTransactionForm from "../components/AddTransactionForm";
import type { TransactionInput } from "../components/AddTransactionForm";
import DonutChart from "../components/DonutChart";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitch";
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Pagination 
} from "@mui/material";
import { useLocalStorage } from "../hooks/useLocalStorage";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;
const SummaryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const SummaryCard = styled.div`
  flex: 1 1 200px;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.primary}10;
  text-align: center;

  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  }

  span {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const TransactionsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;

  th,
  td {
    padding: ${({ theme }) => theme.spacing.sm};
    text-align: left;
  }

  th {
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary}33;
  }

  tr:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.primary}0f;
  }

  td button {
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: #ef7a30;
  border-radius: 10px;
  color: white;

  @media (max-width: 600px) {
    justify-content: center;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const Logo = styled.img`
  width: 200px;
  height: 60px;
  object-fit: contain;
  border-radius: 10px;

  @media (max-width: 600px) {
    width: 100%;
    height: 60px;
  }
`;



type Transaction = {
  id: number;
  date: string;
  description: string;
  category: string;
  type: "income" | "expense";
  amount: number;
  currency: string;
};

const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    "transactions",
    []
  );

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ EUR: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [search, setSearch] = useState("");

  
  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/EUR")
      .then((res) => res.json())
      .then((data) => setExchangeRates(data.rates))
      .catch((err) => console.error("Exchange rate error:", err));
  }, []);

  
  const handleDelete = (id: number) => {
  const updatedTransactions = transactions.filter((t) => t.id !== id);
  setTransactions(updatedTransactions);
  localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
};



  
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const convertToEUR = (amount: number, currency: string) => {
    const rate = exchangeRates[currency];
    if (!rate) return amount;
    return currency === "EUR" ? amount : amount / rate;
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + convertToEUR(t.amount, t.currency), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + convertToEUR(t.amount, t.currency), 0);

  const balance = totalIncome - totalExpenses;

  
  const filteredAndSorted = useMemo(() => {
    let filtered = [...transactions];

    if (search.trim()) {
      filtered = filtered.filter((t) =>
        t.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }

    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
    });

    return filtered;
  }, [transactions, sortBy, sortOrder, filterType, filterCategory, search]);

    const totalPages = Math.ceil(filteredAndSorted.length / rowsPerPage);
    const paginatedTransactions = filteredAndSorted.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );


  return (
    <PageContainer>
      <Header>
        <Logo src="/src/assets/logo1.png" alt="Finance Tracker Logo" />
        <LanguageSwitcher />
      </Header>

      <DonutChart
        transactions={transactions.map((t) => ({
          ...t,
          amount: convertToEUR(t.amount, t.currency),
        }))}
      />

      
      <SummaryContainer>
        <SummaryCard>
          <h3>{t("totalIncome")}</h3>
          <span>
            €{totalIncome.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>
        </SummaryCard>
        <SummaryCard>
          <h3>{t("totalExpenses")}</h3>
          <span>
            €{totalExpenses.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>
        </SummaryCard>
        <SummaryCard>
          <h3>{t("balance")}</h3>
          <span>
            €{balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>
        </SummaryCard>
        <SummaryCard
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <Button
    variant="contained"
    onClick={() => navigate("/add")}
    sx={{
      backgroundColor: "transparent", 
      color: "#ef7a30",
      fontWeight: 600,
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "##ef7a30", 
        boxShadow: "none",
      },
      
    
     
    }}
  >
    +{t("addNewTransaction")}
  </Button>
</SummaryCard>
      </SummaryContainer>
<Typography
  variant="h6"
  sx={{
    textAlign: "center",
    fontWeight: 600,
    mb: 1, 
    color:"#ef7a30"
  }}
>
  {t("filters")}
</Typography>
      
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mb: 3,
          gap: 2,
          width: "100%",
          p: { xs: 1, sm: 2 },
          borderRadius: 2,
          bgcolor: "#ef7a3010",
          boxShadow: 1,
        }}
      >
       
        <TextField
          size="small"
          label={t("searchDescription")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: { xs: "100%", sm: 180, md: 220 } }}
        />

        
        <FormControl
          size="small"
          sx={{ flex: 1, minWidth: { xs: "100%", sm: 120 }, maxWidth: 180 }}
        >
          <InputLabel>{t("type")}</InputLabel>
          <Select
            value={filterType}
            label={t("type")}
            onChange={(e) =>
              setFilterType(e.target.value as "all" | "income" | "expense")
            }
          >
            <MenuItem value="all">{t("all")}</MenuItem>
            <MenuItem value="income">{t("income")}</MenuItem>
            <MenuItem value="expense">{t("expense")}</MenuItem>
          </Select>
        </FormControl>

        
        <FormControl
          size="small"
          sx={{ flex: 1, minWidth: { xs: "100%", sm: 120 }, maxWidth: 180 }}
        >
          <InputLabel>{t("category")}</InputLabel>
          <Select
            value={filterCategory}
            label={t("category")}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <MenuItem value="all">{t("all")}</MenuItem>
            {[...new Set(transactions.map((t) => t.category))].map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        
        <FormControl
          size="small"
          sx={{ flex: 1, minWidth: { xs: "100%", sm: 120 }, maxWidth: 160 }}
        >
          <InputLabel>{t("sortBy")}</InputLabel>
          <Select
            value={sortBy}
            label={t("sortBy")}
            onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
          >
            <MenuItem value="date">{t("date")}</MenuItem>
            <MenuItem value="amount">{t("amount")}</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          size="small"
          sx={{ flex: 1, minWidth: { xs: "100%", sm: 130 }, maxWidth: 160 }}
        >
          <InputLabel>{t("order")}</InputLabel>
          <Select
            value={sortOrder}
            label={t("order")}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <MenuItem value="asc">{t("ascending")}</MenuItem>
            <MenuItem value="desc">{t("descending")}</MenuItem>
          </Select>
        </FormControl>
      </Stack>

     
      <TableContainer>
        <TransactionsTable>
          <thead>
            <tr>
              <th style={{ color: "#ef7a30" }}>{t("date")}</th>
              <th style={{ color: "#ef7a30" }}>{t("description")}</th>
              <th style={{ color: "#ef7a30" }}>{t("category")}</th>
              <th style={{ color: "#ef7a30" }}>{t("type")}</th>
              <th style={{ color: "#ef7a30" }}>{t("originalAmount")}</th>
              <th style={{ color: "#ef7a30" }}>{t("amount")} (EUR)</th>
              <th style={{ color: "#ef7a30" }}>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((t) => (
              <tr key={t.id}>
                <td>{t.date ? new Date(t.date).toLocaleString() : "-"}</td>

                <td>{t.description}</td>
                <td>{t.category}</td>
                <td>{t.type}</td>
                <td>
                  {t.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  {t.currency}
                </td>
                <td>€{convertToEUR(t.amount, t.currency).toFixed(2)}</td>
                <td>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleEdit(t)}
                    sx={{
                      backgroundColor: "#ef7a30",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#ea9966" },
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDelete(t.id)}
                    sx={{
                      borderColor: "#ef7a30",
                      color: "#ef7a30",
                      fontWeight: 600,
                      borderRadius: "8px",
                      "&:hover": { borderColor: "#ef7a30", backgroundColor: "#ef7a3010" },
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "1rem" }}>
                  {t("noTransactions")}
                </td>
              </tr>
            )}
          </tbody>
        </TransactionsTable>
        {totalPages > 1 && (
  <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={(_, value) => setCurrentPage(value)}
      color="primary"
      sx={{
        "& .MuiPaginationItem-root": {
          color: "#ef7a30",
          fontWeight: 600,
        },
        "& .Mui-selected": {
          backgroundColor: "#ef7a30 !important",
          color: "#fff !important",
        },
      }}
    />
  </div>
)}

      </TableContainer>

      
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t("updateTransaction")}</DialogTitle>
        <DialogContent>
          {editingTransaction && (
            <AddTransactionForm
              key={editingTransaction.id}
              editingTransaction={editingTransaction}
              onAdd={(updated: TransactionInput) => {
  const updatedList = transactions.map((t) =>
    t.id === editingTransaction.id
      ? { ...t, ...updated, id: t.id, date: t.date } 
      : t
  );

  setTransactions(updatedList);
  localStorage.setItem("transactions", JSON.stringify(updatedList));

  setIsEditModalOpen(false);
  setEditingTransaction(null);
}}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default TransactionsPage;

