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
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Preloader from "../components/Preloader"; // Importar el Preloader

function Users() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    rol: "",
  });
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true); // Agregado: estado de loading

  const [proveedores, setProveedores] = useState([]);
  const [newProveedor, setNewProveedor] = useState({
    nombre: "",
    contacto: "",
    telefono: "",
  });
  const [searchProveedor, setSearchProveedor] = useState("");
  const [editProveedor, setEditProveedor] = useState(null);
  const [openEditProveedorDialog, setOpenEditProveedorDialog] = useState(false);
  const [openDeleteProveedorDialog, setOpenDeleteProveedorDialog] =
    useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchProveedores = async () => {
      try {
        const response = await api.get("/proveedores");
        setProveedores(response.data);
      } catch (error) {
        console.error("Error fetching proveedores:", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchUsers(), fetchProveedores()]);
      setLoading(false); // Agregado: setLoading(false) después de cargar los datos
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleRoleChange = (e) => {
    setNewUser({ ...newUser, rol: e.target.value });
  };

  const handleAddUser = async () => {
    try {
      const response = await api.post("/register", newUser);
      setUsers([...users, response.data]);
      setNewUser({ username: "", password: "", rol: "" });
      setSnackbarMessage("Usuario agregado correctamente");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error adding user:", error);
      setSnackbarMessage("Error al agregar usuario");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setOpenEditDialog(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleUpdateUser = async () => {
    try {
      await api.put(`/users/${editUser.id}`, editUser);
      setUsers(
        users.map((user) => (user.id === editUser.id ? editUser : user))
      );
      setOpenEditDialog(false);
      setSnackbarMessage("Usuario actualizado correctamente");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error updating user:", error);
      setSnackbarMessage("Error al actualizar usuario");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await api.delete(`/users/${userToDelete.id}`);
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      setOpenDeleteDialog(false);
      setSnackbarMessage("Usuario eliminado correctamente");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error deleting user:", error);
      setSnackbarMessage("Error al eliminar usuario");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleProveedorInputChange = (e) => {
    const { name, value } = e.target;
    setNewProveedor({ ...newProveedor, [name]: value });
  };

  const handleAddProveedor = async () => {
    try {
      const response = await api.post("/proveedores", newProveedor);
      setProveedores([...proveedores, response.data]);
      setNewProveedor({ nombre: "", contacto: "", telefono: "" });
      setSnackbarMessage("Proveedor agregado correctamente");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error adding proveedor:", error);
      setSnackbarMessage("Error al agregar proveedor");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleSearchProveedorChange = (e) => {
    setSearchProveedor(e.target.value);
  };

  const handleEditProveedor = (proveedor) => {
    setEditProveedor(proveedor);
    setOpenEditProveedorDialog(true);
  };

  const handleEditProveedorInputChange = (e) => {
    const { name, value } = e.target;
    setEditProveedor({ ...editProveedor, [name]: value });
  };

  const handleUpdateProveedor = async () => {
    try {
      await api.put(`/proveedores/${editProveedor.id}`, editProveedor);
      setProveedores(
        proveedores.map((proveedor) =>
          proveedor.id === editProveedor.id ? editProveedor : proveedor
        )
      );
      setOpenEditProveedorDialog(false);
      setSnackbarMessage("Proveedor actualizado correctamente");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error updating proveedor:", error);
      setSnackbarMessage("Error al actualizar proveedor");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteProveedor = async () => {
    try {
      await api.delete(`/proveedores/${proveedorToDelete.id}`);
      setProveedores(
        proveedores.filter((proveedor) => proveedor.id !== proveedorToDelete.id)
      );
      setOpenDeleteProveedorDialog(false);
      setSnackbarMessage("Proveedor eliminado correctamente");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error deleting proveedor:", error);
      setSnackbarMessage("Error al eliminar proveedor");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleOpenDeleteProveedorDialog = (proveedor) => {
    setProveedorToDelete(proveedor);
    setOpenDeleteProveedorDialog(true);
  };

  const filteredProveedores = proveedores.filter((proveedor) =>
    proveedor.nombre.toLowerCase().includes(searchProveedor.toLowerCase())
  );

  if (loading) {
    return <Preloader />;
  }

  return (
    <Container maxWidth={false}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" component="h3" gutterBottom>
            Usuarios
          </Typography>
          <Box component="form" sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Nombre de Usuario"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <Select
                  name="rol"
                  value={newUser.rol}
                  onChange={handleRoleChange}
                  fullWidth
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return (
                        <Typography color="textPrimary">
                          Selecciona un rol
                        </Typography>
                      );
                    }
                    return selected;
                  }}
                >
                  <MenuItem value="" disabled>
                    <Typography color="textPrimary">
                      Selecciona un rol
                    </Typography>
                  </MenuItem>
                  <MenuItem value="usuario">Administrador </MenuItem>
                  <MenuItem value="admin">Jefe de Almacén</MenuItem>
                  <MenuItem value="usuario">Auxiliar de Almacén </MenuItem>
                  <MenuItem value="admin">Encargado de Compras</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" sx={{ mt: 0 }}>
              <Grid item xs={9}>
                <TextField
                  label="Buscar Usuario"
                  value={search}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddUser}
                  fullWidth
                >
                  Agregar + Usuarios
                </Button>
              </Grid>
            </Grid>
          </Box>
          <TableContainer
            className="custom-scrollbar"
            component={Paper}
            sx={{
              maxHeight: {
                lg: "54vh", // Para pantallas grandes
                xl: "69vh", // Para pantallas extra grandes
              },
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre de Usuario</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.rol}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditUser(user)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDeleteDialog(user)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" component="h3" gutterBottom>
            Proveedores
          </Typography>
          <Box component="form" sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Nombre de la empresa"
                  name="nombre"
                  value={newProveedor.nombre}
                  onChange={handleProveedorInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Nombre del proveedor"
                  name="contacto"
                  value={newProveedor.contacto}
                  onChange={handleProveedorInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Teléfono"
                  name="telefono"
                  value={newProveedor.telefono}
                  onChange={handleProveedorInputChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" sx={{ mt: 0 }}>
              <Grid item xs={9}>
                <TextField
                  label="Buscar Proveedor"
                  value={searchProveedor}
                  onChange={handleSearchProveedorChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddProveedor}
                  fullWidth
                >
                  Agregar Proveedor
                </Button>
              </Grid>
            </Grid>
          </Box>
          <TableContainer
            className="custom-scrollbar"
            component={Paper}
            sx={{
              maxHeight: {
                lg: "54vh", // Para pantallas grandes
                xl: "69vh", // Para pantallas extra grandes
              },
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Contacto</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProveedores.map((proveedor) => (
                  <TableRow key={proveedor.id}>
                    <TableCell>{proveedor.id}</TableCell>
                    <TableCell>{proveedor.nombre}</TableCell>
                    <TableCell>{proveedor.contacto}</TableCell>
                    <TableCell>{proveedor.telefono}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEditProveedor(proveedor)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          handleOpenDeleteProveedorDialog(proveedor)
                        }
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Modal para editar usuario */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Modifica los campos necesarios y guarda los cambios.
          </DialogContentText>
          <TextField
            label="Nombre de Usuario"
            name="username"
            value={editUser?.username || ""}
            onChange={handleEditInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={editUser?.password || ""}
            onChange={handleEditInputChange}
            fullWidth
            margin="normal"
          />
          <Select
            label="Rol"
            name="rol"
            value={editUser?.rol || ""}
            onChange={handleEditInputChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="usuario">Administrador </MenuItem>
            <MenuItem value="admin">Jefe de Almacén</MenuItem>
            <MenuItem value="usuario">Auxiliar de Almacén </MenuItem>
            <MenuItem value="admin">Encargado de Compras</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleUpdateUser} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para confirmar eliminación de usuario */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Eliminar Usuario</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar este usuario?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteUser} color="primary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para editar proveedor */}
      <Dialog
        open={openEditProveedorDialog}
        onClose={() => setOpenEditProveedorDialog(false)}
      >
        <DialogTitle>Editar Proveedor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Modifica los campos necesarios y guarda los cambios.
          </DialogContentText>
          <TextField
            label="Nombre del Proveedor"
            name="nombre"
            value={editProveedor?.nombre || ""}
            onChange={handleEditProveedorInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contacto"
            name="contacto"
            value={editProveedor?.contacto || ""}
            onChange={handleEditProveedorInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Teléfono"
            name="telefono"
            value={editProveedor?.telefono || ""}
            onChange={handleEditProveedorInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenEditProveedorDialog(false)}
            color="primary"
          >
            Cancelar
          </Button>
          <Button onClick={handleUpdateProveedor} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para confirmar eliminación de proveedor */}
      <Dialog
        open={openDeleteProveedorDialog}
        onClose={() => setOpenDeleteProveedorDialog(false)}
      >
        <DialogTitle>Eliminar Proveedor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar este proveedor?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteProveedorDialog(false)}
            color="primary"
          >
            Cancelar
          </Button>
          <Button onClick={handleDeleteProveedor} color="primary">
            Eliminar
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

export default Users;
