import React from "react";
import AddTransactionForm from "../components/AddTransactionForm";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import type { TransactionInput } from "../components/AddTransactionForm";
import LanguageSwitcher from "../components/LanguageSwitch";
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const FormCard = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background || "#fff"};
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

const Title = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
`;

const AddTransactionPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAddTransaction = (newTransaction: TransactionInput) => {
  const stored = localStorage.getItem("transactions");
  const transactions = stored ? JSON.parse(stored) : [];

  const now = new Date();
  const formattedDate = now.toISOString();


  const transactionWithDate = {
    ...newTransaction,
    id: Date.now(), 
    date: formattedDate,
  };

  localStorage.setItem(
    "transactions",
    JSON.stringify([...transactions, transactionWithDate])
  );

  navigate("/");
};


  return (
    <PageContainer>
      <Header>
        <Logo src="/src/assets/logo1.png" alt="Finance Tracker Logo" />
        <LanguageSwitcher />
      </Header>

      <FormCard>
        <Title>{t("addNewTransaction")}</Title>
        <AddTransactionForm onAdd={handleAddTransaction} />
      </FormCard>
    </PageContainer>
  );
};

export default AddTransactionPage;
