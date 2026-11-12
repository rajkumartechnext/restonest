import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home";
import GenerateQR from "./pages/GenerateQR";
import FoodCategory from "./pages/FoodCategory";
import Pos from "./pages/Pos";
import Table from "./pages/Table";
import UnderPos from "./pages/UnderPos";
import Orders from "./pages/Orders";
import MenuItem from "./pages/MenuItem";
import Company from "./pages/Company";
import Waitter from "./pages/Waitter";
import KitchenMaterial from "./pages/KitchenMaterial";
import OutsourceMaterial from "./pages/OutsourceMaterial";
import KitchenMaterialReport from "./pages/KitchenMaterialReport";
import OutsourceMaterialReport from "./pages/OutsourceMaterialReport";
import Login from "./pages/Login";
import ProfitLoss from "./pages/ProfitLoss";
import Settings from "./pages/Settings";
import Captain from "./pages/Captain";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pos" element={<Pos />} />
        <Route path="/generate-qr" element={<GenerateQR />} />
        <Route path="/food-category" element={<FoodCategory />} />
        <Route path="/table" element={<Table />} />
        <Route path="/under-pos" element={<UnderPos />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/menu-item" element={<MenuItem />} />
        <Route path="/company" element={<Company />} />
        <Route path="/waitter" element={<Waitter />} />
        <Route path="/kitchen-material" element={<KitchenMaterial />} />
        <Route path="/outsource-material" element={<OutsourceMaterial />} />
        <Route
          path="/kitchen-matrials-report"
          element={<KitchenMaterialReport />}
        />
        <Route
          path="/outsource-matrials-report"
          element={<OutsourceMaterialReport />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/profit-loss" element={<ProfitLoss />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/captains" element={<Captain />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
