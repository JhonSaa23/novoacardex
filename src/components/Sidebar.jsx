import PropTypes from 'prop-types';
import { NavLink } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText, Toolbar, IconButton } from "@mui/material";
import { Dashboard, Category, AttachMoney, SwapHoriz, Inventory, People, ChevronLeft, ChevronRight } from "@mui/icons-material";
import logo from '../assets/logo.png';
import { styled } from '@mui/material/styles';
import '../index.css';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  },
}));

const StyledListItem = styled(ListItem)(() => ({
  borderRadius: '10px',
  margin: '5px 10px',
  width: 'auto',  
  '&.active': {
    backgroundColor: '#055ffc', // Azul
    color: '#FFFFFF', // Blanco
    '& .MuiListItemIcon-root': {
      color: '#FFFFFF', // Blanco
    },
  },
  '&:hover': {
    backgroundColor: '#0056b3', // Azul más oscuro
    color: '#FFFFFF', // Blanco
    '& .MuiListItemIcon-root': {
      color: '#FFFFFF', // Blanco
    },
  },
}));

const Sidebar = ({ open, handleDrawerToggle }) => {
  return (
    <StyledDrawer
      variant="permanent"
      sx={{  borderright: '0px solid #000000',
        width: open ? drawerWidth : 60,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: open ? drawerWidth : 60, borderRight: "none" ,boxSizing: 'border-box', backgroundColor: '#ecf3fc',justifycontent: "center" },
      }}
    >
      <Toolbar>
        <NavLink to="/dashboard">
          <img src={logo} alt="Logo" style={{ width: '100%', height: 'auto' }} />
        </NavLink>
        <IconButton onClick={handleDrawerToggle} sx={{ marginLeft: 'auto' }}>
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Toolbar>
      <List sx={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
        <StyledListItem sx={{width: '90%'}} component={NavLink} to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}
        >
          <Dashboard sx={{ marginRight: 2 }}/>
          {open && <ListItemText primary="Dashboard" />}
        </StyledListItem>
        <StyledListItem sx={{width: '90%'}} component={NavLink} to="/productos" className={({ isActive }) => (isActive ? "active" : "")}
        >
          <Category sx={{ marginRight: 2 }}/>
          {open && <ListItemText primary="Productos" />}
        </StyledListItem>
        <StyledListItem sx={{width: '90%'}} component={NavLink} to="/movimientos" className={({ isActive }) => (isActive ? "active" : "")}
        >
          <SwapHoriz sx={{ marginRight: 2 }}/>
          {open && <ListItemText primary="Movimientos" />}
        </StyledListItem>
        <StyledListItem sx={{width: '90%'}} component={NavLink} to="/stock" className={({ isActive }) => (isActive ? "active" : "")}
        >
          <Inventory sx={{ marginRight: 2 }}/>
          {open && <ListItemText primary="Stock" />}
        </StyledListItem>
        <StyledListItem sx={{width: '90%'}} component={NavLink} to="/users" className={({ isActive }) => (isActive ? "active" : "")}
        >
          <People sx={{ marginRight: 2 }}/>
          {open && <ListItemText primary="Usuarios" />}
        </StyledListItem>
        <StyledListItem sx={{width: '90%'}} component={NavLink} to="/ganancias" className={({ isActive }) => (isActive ? "active" : "")}
        >
          <AttachMoney sx={{ marginRight: 2 }}/>
          {open && <ListItemText primary="Ganancias" />}
        </StyledListItem>
      </List>
    </StyledDrawer>
  );
};

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
};

export default Sidebar;