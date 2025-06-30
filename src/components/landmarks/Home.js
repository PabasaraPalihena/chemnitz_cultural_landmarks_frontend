import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import {
  Search,
  StyledInputBase,
  SuggestionsList,
  SuggestionItem,
} from "./Homestyle";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import "./Home.css";
import TopRatedPlaces from "./view/TopRatedPlaces";

export default function Home() {
  const [searchedValue, setSearchedValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleImageLoaded = () => {
    setIsLoading(false);
  };

  const handleSearch = () => {
    navigate(`/search?address=${searchedValue}`);
  };
  const handleInputChange = async (e) => {
    const inputValue = e.target.value;
    setSearchedValue(inputValue);

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${inputValue}&format=json&countrycodes=DE`
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setSearchedValue(suggestion.display_name);
    setSuggestions([]);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <>
      <div style={{ position: "relative" }}>
        {isLoading && (
          <Skeleton variant="rectangular" width="100%" height={450} />
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.3)",
          }}
        ></div>
        <img
          className="center"
          src="https://www.co56.de/site/assets/files/32396/kulturhauptstadt_2025_ernesto_ullmann.2440x1245.jpg"
          //   src="https://ventura-projekt.de/wp-content/uploads/2021/04/AdobeStock_234060381.jpg"
          alt="Chemnitz"
          style={{
            width: "100%",
            height: "480px",
            objectFit: "cover",
            display: isLoading ? "none" : "block",
          }}
          onLoad={handleImageLoaded}
        />
        <div
          style={{
            position: "absolute",
            top: "33%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#fff",
            fontSize: "20px",
            padding: "10px",
            width: "95%",
          }}
        >
          {/* <h1 className="find-heading" style={{ color: "#fff" }}>
            European Cultural City 2025
          </h1> */}
          <h2 className="find-heading" style={{ color: "#fff" }}>
            Discover cultural sites around Chemnitz
          </h2>

          <br />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Search>
              <SearchIcon
                onClick={handleSearch}
                style={{
                  padding: "0 10px",
                  height: "85%",
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "red",
                  right: 5,
                  borderRadius: "100%",
                  width: "20px",
                }}
              />
              <StyledInputBase
                placeholder="Chemnitz, Saxony, Germany"
                inputProps={{ "aria-label": "search" }}
                value={searchedValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              {suggestions.length > 0 && (
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
          </div>
        </div>
      </div>
      <div>
        <h1 className="home__headers">Best Rated Places</h1>
        <TopRatedPlaces />
      </div>
    </>
  );
}
