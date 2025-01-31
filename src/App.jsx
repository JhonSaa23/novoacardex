import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Ganancias from "./pages/Ganancias";
import Movimientos from "./pages/Movimientos";
import Stock from "./pages/Stock";
import Users from "./pages/Users";
import AuthProvider from "./components/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./components/MainLayout";
import { CssBaseline } from "@mui/material";


const App = () => {
  return (
    <AuthProvider>
      <CssBaseline />
      <Routes>
        {/* Ruta pública */}

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/ganancias" element={<Ganancias />} />
          <Route path="/movimientos" element={<Movimientos />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/users" element={<Users />} />
        </Route>

        {/* Ruta para manejar páginas no encontradas */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </AuthProvider>
  );
};

export default App;