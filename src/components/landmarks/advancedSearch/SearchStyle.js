import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { IconButton } from "@mui/material";

export const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "30px 30px 30px 30px",
  backgroundColor: "#F9F9F9",
  border: "1px solid #57ACED",
  "&:hover": {
    backgroundColor: "#F7F7F7",
    border: "1px solid #0081E7",
  },
  marginLeft: "3% !important",
  width: "25%",
  height: "35px",
  paddingTop: "4px",
}));

export const ClearButton = styled(IconButton)(({ theme }) => ({
  padding: 0,
  marginRight: theme.spacing(1),
  color: "#0081E7",
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "85%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "100%",
  color: "#0081E7",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#0081E7",
  width: "calc(100% - 20px)",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

export const SuggestionsList = styled("ul")({
  listStyle: "none",
  background: "#fff",
  fontFamily: "Segoe UI",
  border: "1px solid #ccc",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  position: "absolute",
  zIndex: 10,
  width: "100%",
  maxHeight: "125px",
  overflowY: "auto",
  margin: 0,
  padding: 0,
  marginTop: "2px",
});

export const SuggestionItem = styled("li")(({ theme }) => ({
  padding: "8px",
  cursor: "pointer",
  color: "black",
  textAlign: "left",
  fontSize: "13px",
  fontFamily: "Segoe UI",
  borderBottom: "1px solid #2196f3",
  "&:last-child": {
    borderBottom: "none",
  },
  "&:hover": {
    backgroundColor: "#DAF4FF",
  },
}));
