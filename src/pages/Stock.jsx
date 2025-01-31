import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Container,
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
  Autocomplete, 
  InputAdornment, 
  IconButton
} from '@mui/material';
import { Search } from '@mui/icons-material'; // Importar icono de búsqueda
import Preloader from '../components/Preloader'; // Importar el Preloader
import WhatsAppIcon from '@mui/icons-material/WhatsApp'; // Importar el icono de WhatsApp

function Stock() {
  const [productos, setProductos] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true); // Agregado: estado de loading
  const [filterNombre, setFilterNombre] = useState('');
  const [filterCodigoBarra, setFilterCodigoBarra] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterProveedor, setFilterProveedor] = useState('');
  const [sortStock, setSortStock] = useState('asc');

  const uniqueCategorias = [...new Set(productos.map((producto) => producto.categoria_nombre))];
  const uniqueProveedores = [...new Set(productos.map((producto) => producto.proveedor_nombre))];

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await api.get('/stock');
        const productosConDatos = response.data.map(producto => ({
          ...producto,
          codigo_barra: producto.codigo_barra || 'N/A',
          entradas: producto.entradas || 0,
          salidas: producto.salidas || 0,
          categoria: producto.categoria_nombre || 'Sin categoría',
          proveedor_nombre: producto.proveedor_nombre || 'Sin proveedor',
          proveedor_contacto: producto.proveedor_contacto || 'Sin contacto',
          proveedor_numero: producto.proveedor_telefono || 'Sin número'
        }));
        setProductos(productosConDatos);
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
    let backgroundColor = '#ffb400'; // Color por defecto (amarillo)
    let textColor = 'white'; // Color del texto por defecto
  
    if (stock <= stockMinimo) {
      backgroundColor = '#e76d6d';  
      textColor = '#810000';     
    } else if (stock <= stockMinimo + 30) {
      backgroundColor = '#ffd571';
      textColor = '#745c00';     
    } else if (stock >= stockMinimo + 30) {
      backgroundColor = '#5af968'; 
      textColor = '#106400';       
    }
  
    return {
      backgroundColor,
      color: textColor, // Color del texto
      fontWeight: 'bold', // Texto en negrita
      fontSize: '14px', // Tamaño del texto
      letterSpacing: '1px', // Espaciado entre letras
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

  const handleWhatsAppClick = (numero, nombreProveedor, producto) => {
    const mensaje = `Hola, ${nombreProveedor}! Quisiera hacer un nuevo pedido de ${producto}. ¿Podrías ayudarme?`;
    const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  const handleFilterNombreChange = (event, newValue) => {
    setFilterNombre(newValue);
  };

  const handleFilterCodigoBarraChange = (event) => {
    setFilterCodigoBarra(event.target.value);
  };

  const handleFilterCategoriaChange = (event, newValue) => {
    setFilterCategoria(newValue);
  };

  const handleFilterProveedorChange = (event, newValue) => {
    setFilterProveedor(newValue);
  };

  const handleSortStockChange = () => {
    setSortStock((prevSort) => (prevSort === 'asc' ? 'desc' : 'asc'));
  };

  const filteredProductos = productos
    .filter((producto) => producto.nombre.toLowerCase().includes(filterNombre.toLowerCase()))
    .filter((producto) => producto.codigo_barra.toLowerCase().includes(filterCodigoBarra.toLowerCase()))
    .filter((producto) => producto.categoria_nombre.toLowerCase().includes(filterCategoria.toLowerCase()))
    .filter((producto) => producto.proveedor_nombre.toLowerCase().includes(filterProveedor.toLowerCase()))
    .sort((a, b) => (sortStock === 'asc' ? a.stock - b.stock : b.stock - a.stock));

  if (loading) {
    return <Preloader />;
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TableContainer component={Paper} className="custom-scrollbar" sx={{ overflow: 'auto', flex: 1, maxHeight: {
          lg: '87vh',  // Para pantallas grandes
          xl: '91vh',  // Para pantallas extra grandes
        }, }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>
                  <Autocomplete
                    freeSolo
                    options={productos.map((producto) => producto.nombre)}
                    value={filterNombre}
                    onChange={handleFilterNombreChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nombre"
                        onChange={(e) => setFilterNombre(e.target.value)}
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
                <TableCell>
                  <TextField
                    label="Código de Barras"
                    value={filterCodigoBarra}
                    onChange={handleFilterCodigoBarraChange}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <button onClick={handleSortStockChange}>
                    Stock Actual {sortStock === 'asc' ? '↑' : '↓'}
                  </button>
                </TableCell>
                <TableCell>Entradas</TableCell>
                <TableCell>Salidas</TableCell>
                <TableCell>Stock Mínimo</TableCell>
                <TableCell>
                  <Autocomplete
                    freeSolo
                    options={uniqueCategorias}
                    value={filterCategoria}
                    onChange={handleFilterCategoriaChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Categoría"
                        onChange={(e) => setFilterCategoria(e.target.value)}
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
                <TableCell>
                  <Autocomplete
                    freeSolo
                    options={uniqueProveedores}
                    value={filterProveedor}
                    onChange={handleFilterProveedorChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Proveedor"
                        onChange={(e) => setFilterProveedor(e.target.value)}
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
            <TableBody>
              {filteredProductos.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell>{producto.id}</TableCell>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>{producto.codigo_barra}</TableCell>
                  <TableCell>
                    <span style={getStyle(producto.stock, producto.stock_minimo)}>
                      {producto.stock}
                    </span>
                  </TableCell>
                  <TableCell>{producto.entradas}</TableCell>
                  <TableCell>{producto.salidas}</TableCell>
                  <TableCell>{producto.stock_minimo}</TableCell>
                  <TableCell>{producto.categoria_nombre}</TableCell>
                  <TableCell>
                    <button onClick={() => handleWhatsAppClick(producto.proveedor_numero, producto.proveedor_contacto , producto.nombre)} style={{ display: 'flex', gap: 5, alignItems: 'center', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}>
                      {producto.proveedor_nombre} <WhatsAppIcon />
                    </button>
                  </TableCell>
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