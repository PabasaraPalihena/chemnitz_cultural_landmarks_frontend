import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/material/Stack";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
  SuggestionsList,
  SuggestionItem,
  ClearButton,
} from "./SearchStyle";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import ClearIcon from "@mui/icons-material/Clear";
import { jwtDecode } from "jwt-decode";
import "./AdvancedSearch.css";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

const hometypes = ["Restaurant", "Museum", "Theatre", "Artwork"];

export default function AdvancedSearch({ searchedValue }) {
  const navigate = useNavigate();
  const [value, setSearchedValue] = useState(searchedValue);
  const [homeType, setHomeType] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const token = localStorage.getItem("token");
  const uId = token ? jwtDecode(token).id : null;
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    handleSearch();
  }, [homeType]);

  const handleSearch = () => {
    navigate(`/search?address=${value}&homeType=${homeType.join(",")}`);
  };

  const handleClearSearch = () => {
    setSearchedValue("");
    setSuggestions([]);
    navigate(`/search?homeType=${homeType.join(",")}`);
  };

  const handleInputChange = async (e) => {
    const inputValue = e.target.value;
    setSearchedValue(inputValue);

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${inputValue}&format=json&countrycodes=GE`
      );
      // const suggestionNames = response.data.map(item => item.name);
      // console.log("suggestionNames:",suggestionNames);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    //suggetion.display_name
    setSearchedValue(suggestion.display_name);
    setSuggestions([]);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      setSuggestions([]);
      setIsInputFocused(false);
    }
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleChange_HomeType = (event) => {
    const {
      target: { value },
    } = event;
    setHomeType(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    handleSearch();
  };

  return (
    <div>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Chemnitz, Germany"
            inputProps={{ "aria-label": "search" }}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            // onBlur={handleBlur}
            endAdornment={
              value && (
                <ClearButton onClick={handleClearSearch} size="small">
                  <ClearIcon />
                </ClearButton>
              )
            }
          />
          {/* {isInputFocused && suggestions.length > 0 && ( */}
          {isInputFocused && suggestions.length > 0 && (
            <SuggestionsList>
              {suggestions.map((suggestion) => (
                <SuggestionItem
                  key={suggestion.place_id}
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion.display_name}
                </SuggestionItem>
              ))}
            </SuggestionsList>
          )}
        </Search>

        <>
          <FormControl sx={{ m: 1, width: 150 }} size="small">
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              displayEmpty
              value={homeType}
              onChange={handleChange_HomeType}
              input={
                <OutlinedInput
                  sx={{
                    fontSize: "14.7px",
                    color: "#0081E7",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#57ACED",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0081E7",
                    },
                  }}
                />
              }
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <>HOME TYPE</>;
                }

                return selected.join(", ");
              }}
              MenuProps={MenuProps}
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem disabled value="">
                <em>Home Type</em>
              </MenuItem>
              {hometypes.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={homeType.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      </Stack>
    </div>
  );
}
