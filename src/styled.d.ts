import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      income: string;
      expense: string;
      background: string;
    };
    spacing: {
      sm: string;
      md: string;
      lg: string;
    };
    borderRadius: string;
  }
}
