import { Fragment, useContext, useEffect, useState } from "react";
import NavigationBar from "../../common/NavBar/NavBar";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import ProductCard from "../ProductCard/ProductCard";
import axios from "axios";
import { AuthContext } from "../../common/Auth/AuthContext";
import { useNavigate } from "react-router-dom";

//Toasts
import { SuccessToast, ErrorToast } from "../../common/Toasts/Toasts";

import "./ProductsList.css";

function ProductsList() {
  const { authToken, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const triggerDataFetch = () => {
    console.log("fetching data");
    if (authToken !== null) {
      axios
        .get("http://localhost:3001/api/products/categories", {
            headers: {
              Authorization:`Bearer ${authToken}`,
            },
        })
        .then(function (response) {
          setCategoryList(response.data);
        })
        .catch(function () {
          ErrorToast(
            "Error: There was an issue in retrieving categories list."
          );
        });
      axios
        .get("http://localhost:3001/api/products", {
          headers: {
            Authorization:`Bearer ${authToken}`,
          },
        })
        .then((response) => {
          if (response.data.length > 0) {
            setOriginalData(response.data);
            setData(response.data);
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    triggerDataFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryChange = (event, newCategory) => {
    const newData =
      newCategory === "all"
        ? originalData
        : originalData.filter((item) => item.category === newCategory);
    setCategory(newCategory);
    setData(newData);
  };

  const handleSortChange = (event) => {
    const keyString = event.target.value;
    const temp = [...originalData];
    if (keyString !== "default") {
      if (keyString === "lth") {
        setData(
          temp.sort((a, b) => a.price - b.price
          )
        );
      } 
      if (keyString === "nwst") {
        setData(
          temp.sort((a, b) => new Date(b.date) - new Date(a.date)).reverse()
        );
      }
      if (keyString === "htl") {
        setData(
          temp.sort((a, b) => b.price - a.price
          )
        );
      }
    }
    else {
      setData(temp); 
    }
    setSortBy(keyString);
  };

  const handleSearchChange = (event) => {
    const newData = originalData.filter((item) =>
      item.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setData(newData);
    setSearchTerm(event.target.value);
  };

  const handleDeleteCall = (id, name) => {
    axios
      .delete(`http://localhost:3001/api/products/${id}`, {
          headers: {
            Authorization:`Bearer ${authToken}`,
          },
      })
      .then(function () {
        SuccessToast(`Product ${name} deleted successfully!`);
        triggerDataFetch();
        //navigate("/products");
      })
      .catch(function (error) {
        ErrorToast(
          `Error: There was an issue in deleting product, please try again later.`
        );
      });
  };
  return (
    <Fragment>
      <NavigationBar
        isLogged={authToken !== null}
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      {originalData.length > 0 ? (
        <div className="productsContainer">
          <div className="categorySectionStyle">
            <ToggleButtonGroup
              color="primary"
              value={category}
              exclusive
              onChange={handleCategoryChange}
              aria-label="Category"
            >
              <ToggleButton key="all" value="all">
                ALL
              </ToggleButton>
              {categoryList.map((category) => (
                <ToggleButton key={category} value={category}>
                  {category.toUpperCase()}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>

          <div>
            <FormControl className="sortByDropdown">
              <InputLabel id="sort-select-label">Sort By</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sortBy}
                label="Sort"
                onChange={handleSortChange}
              >
                <MenuItem value={"default"}>Default</MenuItem>
                <MenuItem value={"htl"}>Price: High to Low</MenuItem>
                <MenuItem value={"lth"}>Price: Low to High</MenuItem>
                <MenuItem value={"nwst"}>Newest</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Grid container spacing={5} style={{ margin: "10px 0" }}>
            {data.map((item) => (
              <ProductCard
                key={item.id}
                productData={item}
                isAdmin={isAdmin}
                handleDeleteCall={() => handleDeleteCall(item.id, item.name)}
                navigate={navigate}
              />
            ))}
          </Grid>
        </div>
      ) : (
        <Typography gutterBottom variant="body1" component="p">
          There are no products available.
        </Typography>
      )}
    </Fragment>
  );
}

export default ProductsList;
