import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import styled from "styled-components";

const SwitcherContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <SwitcherContainer>
      <Button
       variant={i18n.language === "en" ? "contained" : "outlined"}
       onClick={() => changeLanguage("en")}
       sx={{
         backgroundColor: "transparent",
         color: "#ffffff",
         fontWeight: 600,
         borderColor: "#ef7a30", 
         "&:hover": {
          backgroundColor: "#ef7a3010", 
          borderColor: "#ef7a30", 
         },
    
          }}
       >
        EN
      </Button>

      <Button
        variant={i18n.language === "sq" ? "contained" : "outlined"}
        onClick={() => changeLanguage("sq")}
        sx={{
        backgroundColor: "transparent",
        color: "#ffffff",
        fontWeight: 600,
        borderColor: "#ef7a30", 
        "&:hover": {
          backgroundColor: "#ef7a3010", 
          borderColor: "#ef7a30", 
         },
    
          }}
      >
        AL
      </Button>
    </SwitcherContainer>
  );
};

export default LanguageSwitcher;
