import { useState, useEffect } from "react";
import api from "../services/api";
import Preloader from "../components/Preloader";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Snackbar,
  Alert,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";

function Ganancias() {
  const [gananciaTotal, setGananciaTotal] = useState(0);
  const [productos, setProductos] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mostrarSinVender, setMostrarSinVender] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const setDefaultDates = () => {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      setStartDate(firstDay.toISOString().split("T")[0]);
      setEndDate(lastDay.toISOString().split("T")[0]);
    };

    setDefaultDates();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchGananciaTotal(startDate, endDate);
      fetchProductos(startDate, endDate);
    }
  }, [startDate, endDate, mostrarSinVender]); // Se ejecuta también cuando cambia el checkbox

  const fetchGananciaTotal = async (startDate, endDate) => {
    try {
      const response = await api.get("/ganancia-por-fechas", {
        params: { startDate, endDate },
      });
      setGananciaTotal(response.data.ganancia_total || 0); // Asegúrate de manejar el caso en que no haya datos
    } catch (error) {
      console.error("Error fetching ganancia total:", error);
      setSnackbarMessage("Error al obtener la ganancia total");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const fetchProductos = async (startDate, endDate) => {
    try {
      const response = await api.get("/productos");
      const productosData = response.data;

      const productosConGanancia = await Promise.all(
        productosData.map(async (producto) => {
          try {
            const gananciaResponse = await api.get(
              `/productos/${producto.id}/ganancia`,
              {
                params: { startDate, endDate },
              }
            );
            return { ...producto, ...gananciaResponse.data };
          } catch (error) {
            console.error(
              `Error fetching ganancia for producto ${producto.id}:`,
              error
            );
            return { ...producto, cantidad_vendida: 0, ganancia_total: 0 };
          }
        })
      );

      // Filtrar productos según el checkbox y ordenar
      const productosFiltrados = productosConGanancia.filter(
        (producto) => mostrarSinVender || producto.cantidad_vendida > 0
      );
      const productosOrdenados = productosFiltrados.sort(
        (a, b) => b.cantidad_vendida - a.cantidad_vendida
      );

      setProductos(productosOrdenados);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching productos:", error);
      setSnackbarMessage("Error al obtener los productos");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setButtonLoading(true);
    fetchGananciaTotal(startDate, endDate);
    fetchProductos(startDate, endDate).finally(() => setButtonLoading(false));
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <Container maxWidth={false}>
      <Box
        display="flex"
        justifyContent="space-between"
        gap={2}
        mb={0}
        p={2}
        borderRadius={4}
        background="linear-gradient(135deg, rgb(165, 214, 167) 0%, rgb(76, 175, 80) 100%)"
        color="white"
      >
        <Box
          sx={{
            width: "250px",
            mb: 0,
            p: 2,
            borderRadius: 4,
            background:
              "linear-gradient(135deg, rgb(165, 214, 167) 0%, rgb(76, 175, 80) 100%)",
            color: "white",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Ganancia Total:
          </Typography>
          <Typography variant="h4" component="h3">
            S/ {parseFloat(gananciaTotal).toFixed(2)}
          </Typography>
        </Box>
        <Box>
          <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
            <TextField
              label="Fecha de inicio"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Fecha de fin"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={handleFilter}
              disabled={buttonLoading}
            >
              {buttonLoading ? <CircularProgress size={24} /> : "Filtrar"}
            </Button>
          </Box>
          <Box
            sx={{
              mb: 0,
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Typography sx={{ mr: 2 }}>Mostrar no Vendidos</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={mostrarSinVender}
                  onChange={(e) => setMostrarSinVender(e.target.checked)}
                  color="success"
                />
              }
            />
          </Box>
        </Box>
      </Box>
      <TableContainer
        component={Paper}
        className="custom-scrollbar"
        sx={{ maxHeight: {
          lg: '64vh',  // Para pantallas grandes
          xl: '75vh',  // Para pantallas extra grandes
        }, overflow: "auto" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Costo</TableCell>
              <TableCell>Cantidad Vendida</TableCell>
              <TableCell>Ganancia Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell>{producto.id}</TableCell>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.precio}</TableCell>
                <TableCell>{producto.costo}</TableCell>
                <TableCell>{producto.cantidad_vendida}</TableCell>
                <TableCell>{producto.ganancia_total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Ganancias;
