import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Categorias = ({ categorias, setCategorias }) => {
  const [newCategoria, setNewCategoria] = useState('');
  const [editCategoria, setEditCategoria] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);

  const handleAddCategoria = () => {
    if (editCategoria) {
      setCategorias(categorias.map(categoria => categoria.id === editCategoria.id ? { ...categoria, nombre: newCategoria } : categoria));
      setEditCategoria(null);
    } else {
      const newCategoriaObj = { id: Date.now(), nombre: newCategoria };
      setCategorias([...categorias, newCategoriaObj]);
    }
    setNewCategoria('');
  };

  const handleEditCategoria = (categoria) => {
    setNewCategoria(categoria.nombre);
    setEditCategoria(categoria);
  };

  const handleOpenDeleteDialog = (categoria) => {
    setCategoriaToDelete(categoria);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCategoriaToDelete(null);
  };

  const handleDeleteCategoria = () => {
    setCategorias(categorias.filter(categoria => categoria.id !== categoriaToDelete.id));
    handleCloseDeleteDialog();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Nombre de la Categoría"
          value={newCategoria}
          onChange={(e) => setNewCategoria(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleAddCategoria} sx={{ ml: 2 }}>
          {editCategoria ? 'Guardar Cambios' : 'Agregar Categoría'}
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map((categoria) => (
              <TableRow key={categoria.id}>
                <TableCell>{categoria.nombre}</TableCell>
                <TableCell sx={{ display: "flex", justifyContent: "center" }}>
                  <IconButton onClick={() => handleEditCategoria(categoria)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(categoria)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Eliminar Categoría</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar la categoría &quot;{categoriaToDelete?.nombre}&quot;?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteCategoria} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

Categorias.propTypes = {
  categorias: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
  setCategorias: PropTypes.func.isRequired,
};

export default Categorias;