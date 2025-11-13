// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import {
//   Button,
//   TextField,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// const FormContainer = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: ${({ theme }) => theme.spacing.md};
//   background-color: #f8f8f8;
//   padding: ${({ theme }) => theme.spacing.md};
//   border-radius: ${({ theme }) => theme.borderRadius};
// `;

// const Row = styled.div`
//   display: flex;
//   gap: ${({ theme }) => theme.spacing.md};
//   flex-wrap: wrap;
// `;

// export type TransactionInput = {
//   date: string;
//   description: string;
//   amount: number;
//   type: "income" | "expense";
//   category: string;
//   currency: string;
// };

// interface AddTransactionFormProps {
//   onAdd: (transaction: TransactionInput) => void;
//   editingTransaction?: TransactionInput | null;
//   onUpdate?: (transaction: TransactionInput) => void;
// }

// const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
//   onAdd,
//   editingTransaction,
//   onUpdate,
// }) => {
//   const [description, setDescription] = useState("");
//   const [amount, setAmount] = useState<number | "">("");
//   const [type, setType] = useState<"income" | "expense">("income");
//   const [category, setCategory] = useState("");
//   const [categories, setCategories] = useState(["Food", "Rent", "Salary", "Other"]);
//   const [currency, setCurrency] = useState("EUR");
//   const [currencies, setCurrencies] = useState<string[]>(["EUR", "USD", "GBP"]);
//   const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
//   const [newCategory, setNewCategory] = useState("");
//     const navigate = useNavigate();
//      const { t } = useTranslation();

  
//   const [errors, setErrors] = useState({
//     description: "",
//     amount: "",
//     category: "",
//   });

  
//   useEffect(() => {
//     if (editingTransaction) {
//       setDescription(editingTransaction.description);
//       setAmount(editingTransaction.amount);
//       setType(editingTransaction.type);
//       setCategory(editingTransaction.category);
//       setCurrency(editingTransaction.currency);
//     }
//   }, [editingTransaction]);

  
//   useEffect(() => {
//     fetch("https://open.er-api.com/v6/latest/EUR")
//       .then((res) => res.json())
//       .then((data) => setCurrencies(Object.keys(data.rates)))
//       .catch((err) => console.error(err));
//   }, []);

//   const validateFields = () => {
//     const newErrors = { description: "", amount: "", category: "" };
//     let valid = true;

//     if (!description.trim()) {
//       newErrors.description = "Description is required";
//       valid = false;
//     }
//     if (!amount || Number(amount) <= 0) {
//       newErrors.amount = "Amount must be greater than 0";
//       valid = false;
//     }
//     if (!category.trim()) {
//       newErrors.category = "Category is required";
//       valid = false;
//     }

//     setErrors(newErrors);
//     return valid;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateFields()) return;

//     const transaction = {
//       date: new Date().toLocaleDateString(),
//       description,
//       amount: Number(amount),
//       type,
//       category,
//       currency,
//     };

//     if (editingTransaction && onUpdate) {
//       onUpdate(transaction);
//     } else {
//       onAdd(transaction);
//     }

//     setDescription("");
//     setAmount("");
//     setType("income");
//     setCategory("");
//     setCurrency("EUR");
//     setErrors({ description: "", amount: "", category: "" });
//   };

//   const handleAddCategory = () => {
//     const trimmed = newCategory.trim();
//     if (trimmed && !categories.includes(trimmed)) {
//       setCategories((prev) => [...prev, trimmed]);
//       setCategory(trimmed);
//     }
//     setNewCategory("");
//     setIsCategoryModalOpen(false);
//   };

//   return (
//     <>
//       <FormContainer onSubmit={handleSubmit}>
//         <Row>
//           <TextField
//             label={t("description")}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             fullWidth
//             error={!!errors.description}
//             helperText={errors.description}
//           />
//           <TextField
//             label={t("amount")}
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount((e.target as HTMLInputElement).valueAsNumber || "")}
//             fullWidth
//             error={!!errors.amount}
//             helperText={errors.amount}
//           />
//         </Row>

//         <Row>
//           <TextField
//             select
//             label={t("type")}
//             value={type}
//             onChange={(e) => setType(e.target.value as "income" | "expense")}
//             fullWidth
//           >
//             <MenuItem value="income">{t("income")}</MenuItem>
//             <MenuItem value="expense">{t("expense")}</MenuItem>
//           </TextField>

//           <TextField
//             select
//             label={t("category")}
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             fullWidth
//             error={!!errors.category}
//             helperText={errors.category}
//           >
//             {categories.map((c) => (
//               <MenuItem key={c} value={c}>
//                 {c}
//               </MenuItem>
//             ))}
//             <MenuItem value="add_new" onClick={() => setIsCategoryModalOpen(true)}>
//               + Add Category
//             </MenuItem>
//           </TextField>

//           <TextField
//             select
//             label={t("currency")}
//             value={currency}
//             onChange={(e) => setCurrency(e.target.value)}
//             fullWidth
//           >
//             {currencies.map((cur) => (
//               <MenuItem key={cur} value={cur}>
//                 {cur}
//               </MenuItem>
//             ))}
//           </TextField>
//         </Row>

//         <Button
//           variant="contained"
//           type="submit"
//           sx={{
//             backgroundColor: "#ef7a30",
//             color: "#fff",
//             fontWeight: 600,
//             "&:hover": { backgroundColor: "#ea9966" },
//           }}
//         >
//           {editingTransaction
//     ? t("updateTransaction")
//     : t("addTransaction")}
//         </Button>
//        {!editingTransaction && (
//   <Button
//     variant="contained"
//     onClick={() => navigate("/")}
//     sx={{
//       backgroundColor: "#fff",
//       color: "#ef7a30",
//       fontWeight: 600,
//       "&:hover": {
//         backgroundColor: "#ef7a3010",
//       },
//     }}
//   >
//     {t("allTransactions")}
//   </Button>
// )}
//       </FormContainer>

//       {/* Add Category Modal */}
//       <Dialog open={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)}>
//         <DialogTitle>{t("addNewCategory")}</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             label={t("categoryName")}
//             value={newCategory}
//             onChange={(e) => setNewCategory(e.target.value)}
//             fullWidth
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => setIsCategoryModalOpen(false)}
//             sx={{
//               borderColor: "#ef7a30",
//               color: "#ef7a30",
//               fontWeight: 600,
//               borderRadius: "8px",
//               "&:hover": {
//                 borderColor: "#ef7a30",
//                 backgroundColor: "#ef7a3010",
//               },
//             }}
//           >
//             {t("cancel")}
//           </Button>
//           <Button
//             onClick={handleAddCategory}
//             variant="contained"
//             sx={{
//               backgroundColor: "#ef7a30",
//               color: "#fff",
//               fontWeight: 600,
//               "&:hover": {
//                 backgroundColor: "#ea9966",
//               },
//             }}
//           >
//             {t("add")}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default AddTransactionForm;

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  background-color: #f8f8f8;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

export type TransactionInput = {
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  currency: string;
};

interface AddTransactionFormProps {
  onAdd: (transaction: TransactionInput) => void;
  editingTransaction?: TransactionInput | null;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
  onAdd,
  editingTransaction,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState(["Food", "Rent", "Salary", "Other"]);
  const [currency, setCurrency] = useState("EUR");
  const [currencies, setCurrencies] = useState<string[]>(["EUR", "USD", "GBP"]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [errors, setErrors] = useState({ description: "", amount: "", category: "" });

  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount);
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setCurrency(editingTransaction.currency);
    }
  }, [editingTransaction]);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/EUR")
      .then((res) => res.json())
      .then((data) => setCurrencies(Object.keys(data.rates)))
      .catch((err) => console.error(err));
  }, []);

  const validateFields = () => {
    const newErrors = { description: "", amount: "", category: "" };
    let valid = true;

    if (!description.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    }
    if (!amount || Number(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
      valid = false;
    }
    if (!category.trim()) {
      newErrors.category = "Category is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    const transaction: TransactionInput = {
      date: editingTransaction ? editingTransaction.date : new Date().toISOString(),
      description,
      amount: Number(amount),
      type,
      category,
      currency,
    };

    onAdd(transaction);

    setDescription("");
    setAmount("");
    setType("income");
    setCategory("");
    setCurrency("EUR");
    setErrors({ description: "", amount: "", category: "" });
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
      setCategory(trimmed);
    }
    setNewCategory("");
    setIsCategoryModalOpen(false);
  };

  return (
    <>
      <FormContainer onSubmit={handleSubmit}>
        <Row>
          <TextField
            label={t("description")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            label={t("amount")}
            type="number"
            value={amount}
            onChange={(e) => setAmount((e.target as HTMLInputElement).valueAsNumber || "")}
            fullWidth
            error={!!errors.amount}
            helperText={errors.amount}
          />
        </Row>

        <Row>
          <TextField
            select
            label={t("type")}
            value={type}
            onChange={(e) => setType(e.target.value as "income" | "expense")}
            fullWidth
          >
            <MenuItem value="income">{t("income")}</MenuItem>
            <MenuItem value="expense">{t("expense")}</MenuItem>
          </TextField>

          <TextField
            select
            label={t("category")}
            value={category}
            onChange={(e) => {
              if (e.target.value === "add_new") {
                setIsCategoryModalOpen(true);
              } else {
                setCategory(e.target.value);
              }
            }}
            fullWidth
            error={!!errors.category}
            helperText={errors.category}
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
            <MenuItem value="add_new">+ {t("addCategory")}</MenuItem>
          </TextField>

          <TextField
            select
            label={t("currency")}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            fullWidth
          >
            {currencies.map((cur) => (
              <MenuItem key={cur} value={cur}>
                {cur}
              </MenuItem>
            ))}
          </TextField>
        </Row>

        <Button
          variant="contained"
          type="submit"
          sx={{
            backgroundColor: "#ef7a30",
            color: "#fff",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#ea9966" },
          }}
        >
          {editingTransaction ? t("updateTransaction") : t("addTransaction")}
        </Button>
        {!editingTransaction && (
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              backgroundColor: "#fff",
              color: "#ef7a30",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#ef7a3010" },
            }}
          >
            {t("allTransactions")}
          </Button>
        )}
      </FormContainer>

      <Dialog open={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)}>
        <DialogTitle>{t("addNewCategory")}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label={t("categoryName")}
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsCategoryModalOpen(false)}
            sx={{
              borderColor: "#ef7a30",
              color: "#ef7a30",
              fontWeight: 600,
              borderRadius: "8px",
              "&:hover": { borderColor: "#ef7a30", backgroundColor: "#ef7a3010" },
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleAddCategory}
            variant="contained"
            sx={{
              backgroundColor: "#ef7a30",
              color: "#fff",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#ea9966" },
            }}
          >
            {t("add")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddTransactionForm;
