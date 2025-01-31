import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Grid,
} from "@mui/material";
import api from '../services/api'; // Asegúrate de importar tu instancia de axios

function ProductoModal({
  open,
  onClose,
  producto,
  categorias,
  onInputChange,
  onFileChange,
  onSave,
}) {
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await api.get('/proveedores');
        setProveedores(response.data);
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
      }
    };

    fetchProveedores();
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {producto.id ? "Editar Producto" : "Crear Producto"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Modifica los campos necesarios y guarda los cambios.
        </DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Nombre de Producto"
              name="nombre"
              value={producto.nombre}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Descripción"
              name="descripcion"
              value={producto.descripcion}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Código de Barra"
              name="codigo_barra"
              value={producto.codigo_barra}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Precio"
              name="precio"
              type="number"
              value={producto.precio}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Costo"
              name="costo"
              type="number"
              value={producto.costo}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={producto.stock}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Stock Mínimo"
              name="stock_minimo"
              type="number"
              value={producto.stock_minimo}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              name="categoriaId"
              value={producto.categoriaId}
              onChange={onInputChange}
              fullWidth
              margin="normal"
              displayEmpty
            >
              <MenuItem value="" disabled>
                <Typography color="textPrimary">Selecciona una categoría</Typography>
              </MenuItem>
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              name="proveedor_id"
              value={producto.proveedor_id}
              onChange={onInputChange}
              fullWidth
              margin="normal"
              displayEmpty
            >
              <MenuItem value="" disabled>
                <Typography color="textPrimary">Selecciona un proveedor</Typography>
              </MenuItem>
              {proveedores.map((proveedor) => (
                <MenuItem key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              name="estado"
              value={producto.estado}
              onChange={onInputChange}
              fullWidth
              margin="normal"
              displayEmpty
            >
              <MenuItem value="" disabled>
                <Typography color="textPrimary">Selecciona un estado</Typography>
              </MenuItem>
              <MenuItem value="activo">Activo</MenuItem>
              <MenuItem value="inactivo">Inactivo</MenuItem>
              <MenuItem value="inactivo">pendiente</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha de Vencimiento"
              name="fecha_vencimiento"
              type="date"
              value={producto.fecha_vencimiento}
              onChange={onInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Descuento (%)"
              name="descuento_porcentaje"
              type="number"
              value={producto.descuento_porcentaje}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Días para Descuento"
              name="dias_para_descuento"
              type="number"
              value={producto.dias_para_descuento}
              onChange={onInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Imagen"
              name="image"
              type="file"
              onChange={onFileChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={onSave} color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ProductoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  producto: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    codigo_barra: PropTypes.string.isRequired,
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    costo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    stock_minimo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    categoriaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    proveedor_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    estado: PropTypes.string.isRequired,
    fecha_vencimiento: PropTypes.string.isRequired,
    descuento_porcentaje: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    dias_para_descuento: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  categorias: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
  proveedores: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ),
  onInputChange: PropTypes.func.isRequired,
  onFileChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ProductoModal;