import { useEffect, useState } from 'react';
import api from '../services/api';
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
} from '@mui/material';
import Preloader from '../components/Preloader'; // Importar el Preloader

function Stock() {
  const [productos, setProductos] = useState([]);
  const [productosConStockMinimo, setProductosConStockMinimo] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true); // Agregado: estado de loading

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await api.get('/stock');
        setProductos(response.data);
        const productosMinimos = response.data.filter(producto => producto.stock <= producto.stock_minimo);
        setProductosConStockMinimo(productosMinimos);
      } catch (error) {
        console.error('Error fetching stock:', error);
        setSnackbarMessage('Error al obtener el stock de los productos');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        setLoading(false); // Agregado: setLoading(false) después de cargar los datos
      }
    };

    fetchStock();
  }, []);

  const getStyle = (stock, stockMinimo) => {
    let backgroundColor = 'inherit';
    if (stock <= stockMinimo) {
      backgroundColor = 'red';
    } else if (stock <= stockMinimo + 10) {
      backgroundColor = 'orange';
    } else if (stock >= stockMinimo + 30) {
      backgroundColor = 'green';
    }
    return {
      backgroundColor,
      color: 'white',
      padding: '2px 5px',
      borderRadius: '5px',
      display: 'inline-block',
      textAlign: 'center',
      width: '50px',
    };
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ display: 'flex', gap: 2,  }}>
        <TableContainer component={Paper} className="custom-scrollbar" sx={{ overflow: 'auto', flex: 1,maxHeight: {
          lg: '78vh',  // Para pantallas grandes
          xl: '83vh',  // Para pantallas extra grandes
        }, }}>
    <Typography variant="h6" mt={2} gutterBottom sx={{ textAlign: 'center' }}>
      Productos en Stock
    </Typography>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Stock Mínimo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Vendidos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell>{producto.id}</TableCell>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>
                    <span style={getStyle(producto.stock, producto.stock_minimo)}>
                      {producto.stock}
                    </span>
                  </TableCell>
                  <TableCell>{producto.stock_minimo}</TableCell>
                  <TableCell>{producto.estado}</TableCell>
                  <TableCell>{producto.vendidos}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer component={Paper} className="custom-scrollbar" sx={{ overflow: 'auto', flex: 1, maxHeight: {
    lg: '79vh',  // Para pantallas grandes
    xl: '83vh',  // Para pantallas extra grandes
  }, }}>
    <Typography variant="h6" mt={2} gutterBottom sx={{ textAlign: 'center' }}>
      Productos por Agotarse
    </Typography>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Stock Mínimo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Vendidos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productosConStockMinimo.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell>{producto.id}</TableCell>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>
                    <span style={getStyle(producto.stock, producto.stock_minimo)}>
                      {producto.stock}
                    </span>
                  </TableCell>
                  <TableCell>{producto.stock_minimo}</TableCell>
                  <TableCell>{producto.estado}</TableCell>
                  <TableCell>{producto.vendidos}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Stock;