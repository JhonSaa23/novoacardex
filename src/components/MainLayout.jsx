import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useEffect, useState } from 'react';
import { Box, CssBaseline } from '@mui/material';

const MainLayout = () => {
  const location = useLocation();
  const [currentTitle, setCurrentTitle] = useState('');
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const routeTitles = {
      '/dashboard': 'Dashboard',
      '/ganancias': 'Ganancias',
      '/movimientos': 'Movimientos',
      '/productos': 'Productos y Categorias',
      '/profile': 'Perfil',
      '/stock': 'Stock',
      '/users': 'Usuarios',
    };

    const newTitle = routeTitles[location.pathname] || 'Inicio';
    setCurrentTitle(newTitle);
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar open={open} handleDrawerToggle={handleDrawerToggle} />
      <Header title={currentTitle} open={open} />
      <Box component="main" sx={{
    flexGrow: 1,
    p: 0,
    mt: 8,
    height: {
      xs: '70vh',  // En pantallas pequeñas (como teléfonos móviles)
      sm: '70vh',  // En pantallas medianas (como tablets)
      md: '90vh',  // En pantallas grandes (como escritorios)
      lg: '80vh',
      xl: '90vh', // En pantallas muy grandes
    }
  }}
>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;