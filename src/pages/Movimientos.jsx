import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import api from "../services/api";
import Preloader from "../components/Preloader";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Grid,
  CircularProgress,
  InputAdornment,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { Search, ArrowUpward, ArrowDownward } from "@mui/icons-material";

function Movimientos() {
  const { user } = useContext(AuthContext); // Verifica que el contexto esté proporcionando el usuario correctamente
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState("");
  const [tipoMovimiento, setTipoMovimiento] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [searchUsuario, setSearchUsuario] = useState("");
  const [searchCantidad] = useState("");
  const [searchMovimiento, setSearchMovimiento] = useState("");
  const [searchCodigo, setSearchCodigo] = useState("");
  const [searchNombre, setSearchNombre] = useState("");
  const [searchFechaInicio, setSearchFechaInicio] = useState("");
  const [searchFechaFin, setSearchFechaFin] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Estado para el orden de la cantidad

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get("/productos");
        setProductos(response.data);
      } catch (error) {
        console.error("Error fetching productos:", error);
      }
    };

    const fetchMovimientos = async () => {
      try {
        const response = await api.get("/movimientos");
        setMovimientos(response.data);
      } catch (error) {
        console.error("Error fetching movimientos:", error);
      }
    };

    const fetchUsuarios = async () => {
      try {
        const response = await api.get("/users");
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error fetching usuarios:", error);
      }
    };

    fetchProductos();
    fetchMovimientos().finally(() => setLoading(false));
    fetchUsuarios();
  }, []);

  const handleMovimiento = async () => {
    if (!selectedProducto || !tipoMovimiento || !cantidad) {
      setSnackbarMessage("Todos los campos son obligatorios");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!user) {
      // Verifica si el usuario está autenticado
      setSnackbarMessage("Usuario no autenticado");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    setButtonLoading(true);
    try {
      const response = await api.post(
        `/productos/${selectedProducto}/movimiento`,
        {
          tipo: tipoMovimiento,
          cantidad: parseInt(cantidad, 10),
          usuario: user.username, // Asegúrate de que el usuario tenga la propiedad username
        }
      );
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setCantidad("");
      setTipoMovimiento("");
      setSelectedProducto("");
      const updatedMovimientos = await api.get("/movimientos");
      setMovimientos(updatedMovimientos.data);
    } catch (error) {
      console.error("Error updating stock:", error);
      setSnackbarMessage("Error al actualizar stock");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSortCantidad = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    setMovimientos((prevMovimientos) =>
      [...prevMovimientos].sort((a, b) =>
        newSortOrder === "asc"
          ? a.cantidad - b.cantidad
          : b.cantidad - a.cantidad
      )
    );
  };

  const handleClearFilters = () => {
    setSearchUsuario("");
    setSearchMovimiento("");
    setSearchCodigo("");
    setSearchNombre("");
    setSearchFechaInicio("");
    setSearchFechaFin("");
  };

  const filteredMovimientos = movimientos.filter((movimiento) => {
    const fechaMovimiento = new Date(movimiento.fecha);
    const fechaInicio = searchFechaInicio ? new Date(searchFechaInicio) : null;
    const fechaFin = searchFechaFin ? new Date(searchFechaFin) : null;

    return (
      (!fechaInicio || fechaMovimiento >= fechaInicio) &&
      (!fechaFin || fechaMovimiento <= fechaFin) &&
      (movimiento.codigo_barra
        ?.toLowerCase()
        .includes(searchCodigo.toLowerCase()) ||
        "") &&
      (movimiento.producto_nombre
        ?.toLowerCase()
        .includes(searchNombre.toLowerCase()) ||
        "") &&
      (movimiento.usuario
        ?.toLowerCase()
        .includes(searchUsuario.toLowerCase()) ||
        "") &&
      (movimiento.cantidad?.toString().includes(searchCantidad) || "") &&
      (movimiento.tipo
        ?.toLowerCase()
        .includes(searchMovimiento.toLowerCase()) ||
        "")
    );
  });
  
  const getMovimientoStyle = (tipo) => {
    let backgroundColor = tipo === "entrada" ? "#5af968" : "#ffb400"; // Verde para entrada, naranja para salida
    let textColor = tipo === "entrada" ? "#106400" : "#745c00";
  
    return {
      backgroundColor,
      color: textColor,
      fontWeight: "bold",
      fontSize: "14px",
      marginTop: "15px",
      marginLeft: "20px",
      letterSpacing: "1px",
      padding: "2px 5px",
      borderRadius: "5px",
      display: "inline-block",
      textAlign: "center",
      width: "80px",
    };
  };
  

  if (loading) {
    return <Preloader />;
  }

  return (
    <Container maxWidth={false} sx={{ mt: 1 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Select
          value={selectedProducto}
          onChange={(e) => setSelectedProducto(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>
            Selecciona un producto
          </MenuItem>
          {productos.map((producto) => (
            <MenuItem key={producto.id} value={producto.id}>
              {producto.nombre}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={tipoMovimiento}
          onChange={(e) => setTipoMovimiento(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>
            Tipo de Movimiento
          </MenuItem>
          <MenuItem value="entrada">Entrada</MenuItem>
          <MenuItem value="salida">Salida</MenuItem>
        </Select>
        <TextField
          label="Cantidad"
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          fullWidth
        />
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleMovimiento}
            disabled={buttonLoading}
          >
            {buttonLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Registrar Movimiento"
            )}
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClearFilters}
          >
            Limpiar Filtros
          </Button>
        </Grid>
      </Box>
      <TableContainer
        component={Paper}
        className="custom-scrollbar"
        sx={{
          maxHeight: {
            lg: "71vh",
            xl: "80vh",
          },
          overflow: "auto",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "22.1%" }}>
                <TextField
                  label="Fecha Inicio"
                  type="date"
                  value={searchFechaInicio}
                  onChange={(e) => setSearchFechaInicio(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Fecha Fin"
                  type="date"
                  value={searchFechaFin}
                  onChange={(e) => setSearchFechaFin(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </TableCell>
              <TableCell sx={{ width: "20%" }}>
                <Autocomplete
                  freeSolo
                  options={productos.map((producto) => producto.nombre)}
                  value={searchNombre}
                  onChange={(e, newValue) => setSearchNombre(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Nombre"
                      onChange={(e) => setSearchNombre(e.target.value)}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton>
                              <Search />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell sx={{ width: "12%" }}>
                <TextField
                  label="Codigo"
                  value={searchCodigo}
                  onChange={(e) => setSearchCodigo(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <Search />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </TableCell>
              <TableCell sx={{ width: "8%" }}>
                <Select
                  value={searchMovimiento}
                  onChange={(e) => setSearchMovimiento(e.target.value)}
                  displayEmpty
                  fullWidth
                  sx={{ textAlign: "center" }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="entrada">Entrada</MenuItem>
                  <MenuItem value="salida">Salida</MenuItem>
                </Select>
              </TableCell >
              <TableCell sx={{ textAlign: "center", width: "8%" }}>
                <IconButton onClick={handleSortCantidad}>
                  {sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />}
                </IconButton>
              </TableCell>
              <TableCell>
                <Autocomplete
                  freeSolo
                  options={usuarios.map((usuario) => usuario.username)}
                  value={searchUsuario}
                  onChange={(e, newValue) => setSearchUsuario(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Usuario"
                      onChange={(e) => setSearchUsuario(e.target.value)}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton>
                              <Search />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {filteredMovimientos.map((movimiento) => (
              <TableRow key={movimiento.id}>
                <TableCell>
                  {new Date(movimiento.fecha).toLocaleString()}
                </TableCell>
                <TableCell>{movimiento.producto_nombre}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{movimiento.codigo_barra}</TableCell>
                <TableCell style={getMovimientoStyle(movimiento.tipo)} sx={{ textAlign: "center" }}>{movimiento.tipo}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{movimiento.cantidad}</TableCell>
                <TableCell>{movimiento.usuario}</TableCell>
                
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

export default Movimientos;
