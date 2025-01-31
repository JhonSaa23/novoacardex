import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Container,
  Typography,
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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

import Categorias from "../components/Categorias";
import ProductoModal from "../components/ProductoModal"; // Importar el nuevo componente
import Preloader from '../components/Preloader'; // Importar el Preloader

function Productos() {
  const getPriceStyle = (
    precio_venta,
    dias_para_descuento,
    fecha_vencimiento
  ) => {
    const fechaActual = new Date();

    // Crear la fecha de vencimiento en formato "DD/MM/YYYY"
    const [dia, mes, anio] = fecha_vencimiento.split("/");
    const fechaVencimiento = new Date(`${mes}/${dia}/${anio}`); // Formato "MM/DD/YYYY" para JavaScript

    // Verificar si la fecha de vencimiento es válida
    if (isNaN(fechaVencimiento.getTime())) {
      return {
        backgroundColor: "gray", // Estilo predeterminado para fechas inválidas
        color: "white",
        padding: "2px 5px",
        borderRadius: "5px",
        display: "inline-block",
        textAlign: "center",
        width: "50px",
      };
    }

    // Verificar si dias_para_descuento es un número válido
    if (typeof dias_para_descuento !== "number" || isNaN(dias_para_descuento)) {
      return {
        backgroundColor: "gray", // Estilo predeterminado para días inválidos
        color: "white",
        padding: "2px 5px",
        borderRadius: "5px",
        display: "inline-block",
        textAlign: "center",
        width: "50px",
      };
    }

    // Calcular la diferencia en días
    const diferenciaDias = Math.ceil(
      (fechaVencimiento - fechaActual) / (1000 * 60 * 60 * 24)
    );

    // Aplicar el estilo correspondiente
    return {
      backgroundColor: diferenciaDias <= dias_para_descuento ? "green" : "blue",
      color: "white",
      padding: "2px 5px",
      borderRadius: "5px",
      display: "inline-block",
      textAlign: "center",
      width: "50px",
    };
  };

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [newProducto, setNewProducto] = useState({
    nombre: "",
    descripcion: "",
    codigo_barra: "",
    precio: "",
    precio_venta: "",
    costo: "",
    stock: "",
    stock_minimo: "",
    categoriaId: "",
    proveedor_id: "",
    estado: "",
    fecha_vencimiento: "",
    descuento_porcentaje: "",
    dias_para_descuento: "",
  });
  const [search, setSearch] = useState("");
  const [editProducto, setEditProducto] = useState(null);
  const [openEditProductoDialog, setOpenEditProductoDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [viewProducto, setViewProducto] = useState(null);
  const [openViewProductoDialog, setOpenViewProductoDialog] = useState(false);
  const [loading, setLoading] = useState(true); // Agregado: estado de loading

  const handleViewProducto = (producto) => {
    setViewProducto(producto);
    setOpenViewProductoDialog(true);
  };

  const [anchorElCategorias, setAnchorElCategorias] = useState(null);
  const [anchorElAcciones, setAnchorElAcciones] = useState(null);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const handleMenuOpenCategorias = (event) => {
    setAnchorElCategorias(event.currentTarget);
  };

  const handleMenuCloseCategorias = () => {
    setAnchorElCategorias(null);
  };

  const handleMenuOpenAcciones = (event, producto) => {
    setAnchorElAcciones(event.currentTarget);
    setSelectedProducto(producto);
  };

  const handleMenuCloseAcciones = () => {
    setAnchorElAcciones(null);
    setSelectedProducto(null);
  };

  const fetchCategorias = async () => {
    try {
      const response = await api.get("/categorias");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await api.get("/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchCategorias(), fetchProductos()]);
      setLoading(false); // Agregado: setLoading(false) después de cargar los datos
    };

    fetchData();
  }, []);

  const handleProductoInputChange = (e) => {
    const { name, value } = e.target;
    setNewProducto({ ...newProducto, [name]: value });
    if (editProducto) {
      setEditProducto({ ...editProducto, [name]: value });
    }
  };

  const handleProductoFileChange = (e) => {
    const { name, files } = e.target;
    setNewProducto({ ...newProducto, [name]: files[0] });
    if (editProducto) {
      setEditProducto({ ...editProducto, [name]: files[0] });
    }
  };

  const handleAddProducto = async () => {
    // Validar campos obligatorios
    const { nombre, precio, costo, categoriaId, proveedor_id } = newProducto;
    console.log("Valores del formulario:", {
      nombre,
      precio,
      costo,
      categoriaId,
      proveedor_id,
    });

    if (!nombre || !precio || !costo || !categoriaId || !proveedor_id) {
      setSnackbarMessage(
        "Nombre, precio, costo, categoría y proveedor son obligatorios"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("precio", precio);
    formData.append("costo", costo);
    formData.append("categoria_id", categoriaId);
    formData.append("proveedor_id", proveedor_id);
    Object.keys(newProducto).forEach((key) => {
      if (
        !["nombre", "precio", "costo", "categoriaId", "proveedor_id"].includes(
          key
        )
      ) {
        formData.append(key, newProducto[key]);
      }
    });

    try {
      const response = await api.post("/productos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProductos([...productos, response.data]);
      setNewProducto({
        nombre: "",
        descripcion: "",
        codigo_barra: "",
        precio: "",
        precio_venta: "",
        costo: "",
        stock: "",
        stock_minimo: "",
        categoriaId: "",
        proveedor_id: "",
        estado: "",
        fecha_vencimiento: "",
        descuento_porcentaje: "",
        dias_para_descuento: "",
      });
      setSnackbarMessage("Producto agregado correctamente");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      fetchProductos();
      setOpenEditProductoDialog(false); // Cerrar el modal después de agregar el producto
    } catch (error) {
      console.error("Error adding producto:", error);
      if (error.response) {
        // El servidor respondió con un estado diferente de 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        setSnackbarMessage(
          `Error al agregar producto: ${
            error.response.data.message || error.response.status
          }`
        );
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error("Error request:", error.request);
        setSnackbarMessage(
          "Error al agregar producto: No se recibió respuesta del servidor"
        );
      } else {
        // Algo pasó al configurar la solicitud
        console.error("Error message:", error.message);
        setSnackbarMessage(`Error al agregar producto: ${error.message}`);
      }
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleEditProducto = (producto) => {
    setEditProducto({
      ...producto,
      categoriaId: producto.categoria_id,
      fecha_vencimiento: producto.fecha_vencimiento
        .split("/")
        .reverse()
        .join("-"), // Convertir la fecha a formato ISO
    });
    setOpenEditProductoDialog(true);
  };

  const handleUpdateProducto = async () => {
    const formData = new FormData();
    Object.keys(editProducto).forEach((key) => {
      formData.append(key, editProducto[key]);
    });

    try {
      await api.put(`/productos/${editProducto.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProductos(
        productos.map((producto) =>
          producto.id === editProducto.id ? editProducto : producto
        )
      );
      await fetchProductos();

      setOpenEditProductoDialog(false);
      setSnackbarMessage("Producto actualizado correctamente");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      fetchProductos();
    } catch (error) {
      console.error("Error updating producto:", error);
      setSnackbarMessage("Error al actualizar producto");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleOpenDeleteDialog = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setOpenDeleteDialog(true);
  };

  const handleDeleteItem = async () => {
    try {
      if (deleteType === "categoria") {
        await api.delete(`/categorias/${itemToDelete.id}`);
        setCategorias(
          categorias.filter((categoria) => categoria.id !== itemToDelete.id)
        );
        fetchCategorias();
        setSnackbarMessage("Categoría eliminada correctamente");
      } else if (deleteType === "producto") {
        await api.delete(`/productos/${itemToDelete.id}`);
        setProductos(
          productos.filter((producto) => producto.id !== itemToDelete.id)
        );
        fetchProductos();
        setSnackbarMessage("Producto eliminado correctamente");
      }
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
      setSnackbarMessage(`Error al eliminar ${deleteType}`);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenCreateProductoDialog = () => {
    setEditProducto(null);
    setOpenEditProductoDialog(true);
  };

  const filteredProductos = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(search.toLowerCase()) ||
    producto.codigo_barra.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <Preloader />;
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ display: "flex", gap: 4 }}>
        <Box
          sx={{ flex: 2, padding: 2, paddingBottom: 0, borderRadius: 4, background: "#ffffff" }}
        >
          <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
            <TextField
              label="Buscar Producto"
              value={search}
              onChange={handleSearchChange}
              fullWidth
            />
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenCreateProductoDialog}
              sx={{ width: "200px" }}
            >
              Crear Producto
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleMenuOpenCategorias}
            >
              Ver Categorías
            </Button>
            <Menu
              anchorEl={anchorElCategorias}
              open={Boolean(anchorElCategorias)}
              onClose={handleMenuCloseCategorias}
            >
              <Categorias
                categorias={categorias}
                setCategorias={setCategorias}
              />
            </Menu>
          </Box>

          <TableContainer
            component={Paper}
            className="custom-scrollbar"
            sx={{
              maxHeight: {
                lg: "73vh",
                xl: "82vh",
              },
              overflow: "auto",
            }}
          >
            <Box sx={{ overflowY: "auto", maxWidth: "100%" }}>
              <Table sx={{ minWidth: 650 }} stickyHeader >
                <TableHead > 
                  <TableRow>
                    <TableCell sx={{ width: "0%" }}>Imagen</TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Código de Barras
                    </TableCell>
                    <TableCell sx={{ width: "30%" }}>Nombre</TableCell>
                    <TableCell sx={{ width: "0%", textAlign: "center" }}>
                      Precio
                    </TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell sx={{ width: "25%" }}>Categoría</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha de Vencimiento</TableCell>
                    <TableCell
                      sx={{
                        width: "11%",
                        textAlign: "center",
                        position: "sticky",
                        right: 0,
                        backgroundColor: "white",
                        zIndex: 1,
                      }}
                    >
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProductos.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell>
                        <img
                          src={producto.image_url}
                          alt={producto.nombre}
                          style={{ width: "50px", height: "50px" }}
                        />
                      </TableCell>
                      <TableCell>{producto.codigo_barra}</TableCell>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {producto.nombre}
                      </TableCell>
                      <TableCell sx={{ width: "15%", textAlign: "center" }}>
                        <span
                          style={getPriceStyle(
                            producto.precio_venta,
                            producto.dias_para_descuento,
                            producto.fecha_vencimiento
                          )}
                        >
                          {producto.precio_venta}
                        </span>
                      </TableCell>
                      <TableCell>{producto.stock}</TableCell>
                      <TableCell>{producto.categoria_nombre}</TableCell>
                      <TableCell>{producto.estado}</TableCell>
                      <TableCell>{producto.fecha_vencimiento}</TableCell>
                      <TableCell
                        sx={{
                          position: "sticky",
                          right: 0,
                          backgroundColor: "white",
                          zIndex: 1,
                        }}
                      >
                        <IconButton
                          onClick={(event) =>
                            handleMenuOpenAcciones(event, producto)
                          }
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorElAcciones}
                          open={
                            Boolean(anchorElAcciones) &&
                            selectedProducto?.id === producto.id
                          }
                          onClose={handleMenuCloseAcciones}
                        >
                          <MenuItem
                            onClick={() => {
                              handleViewProducto(producto);
                              handleMenuCloseAcciones();
                            }}
                            style={{ color: "blue" }}
                          >
                            <Visibility /> Ver
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleEditProducto(producto);
                              handleMenuCloseAcciones();
                            }}
                            style={{ color: "green" }}
                          >
                            <Edit /> Editar
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleOpenDeleteDialog(producto, "producto");
                              handleMenuCloseAcciones();
                            }}
                            style={{ color: "red" }}
                          >
                            <Delete /> Eliminar
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </TableContainer>
        </Box>
      </Box>

      <ProductoModal
        open={openEditProductoDialog}
        onClose={() => setOpenEditProductoDialog(false)}
        producto={editProducto || newProducto}
        categorias={categorias}
        onInputChange={handleProductoInputChange}
        onFileChange={handleProductoFileChange}
        onSave={editProducto ? handleUpdateProducto : handleAddProducto}
      />

      {/* Modal para confirmar eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>
          Eliminar {deleteType === "categoria" ? "Categoría" : "Producto"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar este{" "}
            {deleteType === "categoria" ? "categoría" : "producto"}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteItem} color="primary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openViewProductoDialog}
        onClose={() => setOpenViewProductoDialog(false)}
      >
        <DialogTitle>Información del Producto</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={viewProducto?.image_url}
              alt={viewProducto?.nombre}
              style={{ width: "100px", height: "100px", marginBottom: "16px" }}
            />
            <Typography variant="h6">{viewProducto?.nombre}</Typography>
            <Typography variant="body1">
              <strong>ID:</strong> {viewProducto?.id}
            </Typography>
            <Typography variant="body1">
              <strong>Descripción:</strong> {viewProducto?.descripcion}
            </Typography>
            <Typography variant="body1">
              <strong>Código de Barra:</strong> {viewProducto?.codigo_barra}
            </Typography>
            <Typography variant="body1">
              <strong>Precio:</strong> {viewProducto?.precio}
            </Typography>
            <Typography variant="body1">
              <strong>Costo:</strong> {viewProducto?.costo}
            </Typography>
            <Typography variant="body1">
              <strong>Stock:</strong> {viewProducto?.stock}
            </Typography>
            <Typography variant="body1">
              <strong>Stock Mínimo:</strong> {viewProducto?.stock_minimo}
            </Typography>
            <Typography variant="body1">
              <strong>Categoría:</strong> {viewProducto?.categoria_nombre}
            </Typography>
            <Typography variant="body1">
              <strong>Estado:</strong> {viewProducto?.estado}
            </Typography>
            <Typography variant="body1">
              <strong>Fecha de Vencimiento:</strong>{" "}
              {viewProducto?.fecha_vencimiento}
            </Typography>
            <Typography variant="body1">
              <strong>Descuento (%):</strong>{" "}
              {viewProducto?.descuento_porcentaje}
            </Typography>
            <Typography variant="body1">
              <strong>Días para Descuento:</strong>{" "}
              {viewProducto?.dias_para_descuento}
            </Typography>
            <Typography variant="body1">
              <strong>Precio de Venta:</strong> {viewProducto?.precio_venta}
            </Typography>
            <Typography variant="body1">
              <strong>Ganancia:</strong> {viewProducto?.ganancia}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenViewProductoDialog(false)}
            color="primary"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mostrar mensajes */}
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

export default Productos;
