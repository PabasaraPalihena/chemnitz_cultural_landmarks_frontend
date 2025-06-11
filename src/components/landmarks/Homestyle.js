import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

export const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "50px",
  backgroundColor: alpha(theme.palette.common.white, 0.85),
  cursor: "pointer",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "35%",
  height: "45px",
  paddingTop: "4px",

  "@media (max-width: 1500px)": {
    width: "40%",
    height: "45px",
  },
  "@media (max-width: 750px)": {
    width: "70%",
    height: "45px",
  },
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "85%",
  position: "absolute",
  pointerEvents: "auto",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "red",
  right: 5,
  borderRadius: "100%",
  width: "10px",
  border: "none",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    color: "black",
    padding: theme.spacing(1, 0, 0, 0),
    transition: theme.transitions.create("width"),
    width: "100%",
    height: "35px",
  },
}));

// Additional CSS for suggestions
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
  padding: "12px",
  cursor: "pointer",
  color: "black",
  textAlign: "left",
  fontSize: "12px",
  fontFamily: "Segoe UI",
  borderBottom: "1px solid #2196f3",
  "&:last-child": {
    borderBottom: "none",
  },
  "&:hover": {
    backgroundColor: "#DAF4FF",
  },
}));
