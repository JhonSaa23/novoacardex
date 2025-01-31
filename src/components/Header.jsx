import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../contexts/authContext';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';

const drawerWidth = 240;

const Header = ({ title, open }) => {
  const { logout } = useContext(AuthContext);
  const username = localStorage.getItem('username');
  const rol = localStorage.getItem('rol');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${open ? drawerWidth : 60}px)`,
        ml: `${open ? drawerWidth : 60}px`,
        transition: 'width 0.3s, margin-left 0.3s',
        backgroundColor: '#ecf3fc',
        color: '#000000',
        boxShadow: 'none',
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#e0e0e0',
            padding: '3px 13px',
            borderRadius: '5px',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', marginRight: '5px', textAlign: 'right' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {username}
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              {rol}
            </Typography>
          </Box>
          <Button
            color="inherit"
            onClick={handleMenuClick}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            ▼
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={logout}>Cerrar sesión</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
};

export default Header;