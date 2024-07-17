import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import { AuthContextProvider } from "../src/common/Auth/AuthContext";
import LogIn from "../src/components/LogIn/LogIn";
import ProductsList from "./components/ProductsList/ProductsList";
import ProductDetail from "../src/components/ProductDetails/ProductDetail";
import AddUpdateProduct from "./components/addUpdateProduct/AddUpdateProduct";
import OrderProduct from "../src/components/Orders/OrderProduct";
import SignUp from "../src/components/SignUp/SignUp";

const appTheme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f44336",
    },
  },
});

function App() {
  return (
    <AuthContextProvider>
      <ThemeProvider theme={appTheme}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LogIn />} />
            <Route exact path="/" element={<Navigate to="/login" />} />
            <Route exact path="/products" element={<ProductsList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/editProduct/:id" element={<AddUpdateProduct />} />
            <Route path="/addProduct" element={<AddUpdateProduct />} />
            <Route path="/placeOrder" element={<OrderProduct />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthContextProvider>
  );
}

export default App;
