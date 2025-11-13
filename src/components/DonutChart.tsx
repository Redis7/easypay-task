import React from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";
import styled from "styled-components";
import type { TransactionInput } from "./AddTransactionForm";
import { useTranslation } from "react-i18next";

interface DonutChartProps {
  transactions: TransactionInput[];
}

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const COLORS = ["#ef7a30", "#f4b183"]; 

const DonutChart: React.FC<DonutChartProps> = ({ transactions }) => {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Formatojme numrat ne decimal
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
    const { t } = useTranslation();

  const data = [
    { name: t("income"), value: totalIncome },
    { name: t("expense"), value: totalExpenses },
  ];
  

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={50}
            label={(entry) => `${formatCurrency(entry.value)}`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>

          
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #ef7a30",
              color: "#333",
            }}
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default DonutChart;
