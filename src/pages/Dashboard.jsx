import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { AttachMoney, Inventory, People, SwapHoriz, ArrowBack, ArrowForward } from "@mui/icons-material";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Preloader from '../components/Preloader';

const Dashboard = () => {
  const [gananciaMensual, setGananciaMensual] = useState([]);
  const [ setVentasComprasMensuales] = useState([]); // Corregido: se eliminó el "set" del nombre del estado
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [visible, setVisible] = useState(false); // Agregado: estado de visibilidad

  useEffect(() => {
    const fetchGananciaMensual = async () => {
      try {
        const response = await api.get("/ganancia-mensual");
        setGananciaMensual(response.data);
      } catch (error) {
        console.error("Error fetching ganancia mensual:", error);
      }
    };

    const fetchVentasComprasMensuales = async () => {
      try {
        const response = await api.get("/ventas-compras-mensuales");
        setVentasComprasMensuales(response.data);
      } catch (error) {
        console.error("Error fetching ventas y compras mensuales:", error);
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

    const fetchUsuarios = async () => {
      try {
        const response = await api.get("/users");
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error fetching usuarios:", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([
        fetchGananciaMensual(),
        fetchVentasComprasMensuales(),
        fetchProductos(),
        fetchUsuarios(),
      ]);
      setLoading(false); // Agregado: setLoading(false) después de cargar los datos
      setVisible(true); // Agregado: setVisible(true) para mostrar la vista con transición
    };

    fetchData();
  }, []); // Corregido: se eliminó "setVentasComprasMensuales" de las dependencias

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const response = await api.get("/movimientos");
        setMovimientos(response.data);
      } catch (error) {
        console.error("Error fetching movimientos:", error);
      }
    };

    fetchMovimientos();
  }, [currentMonth, currentYear]); // Actualizar datos cuando cambian el mes o el año

  // Procesar datos para el gráfico de líneas y barras
  const procesarDatosMovimientos = (movimientos) => {
    const datosPorDia = {};
    let totalEntradas = 0;
    let totalSalidas = 0;

    movimientos.forEach((movimiento) => {
      const fecha = new Date(movimiento.fecha);
      if (fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear) {
        const fechaStr = fecha.toISOString().split('T')[0];
        if (!datosPorDia[fechaStr]) {
          datosPorDia[fechaStr] = { fecha: fechaStr, entradas: 0, salidas: 0 };
        }
        if (movimiento.tipo === 'entrada') {
          datosPorDia[fechaStr].entradas += movimiento.cantidad;
          totalEntradas += movimiento.cantidad;
        } else if (movimiento.tipo === 'salida') {
          datosPorDia[fechaStr].salidas += movimiento.cantidad;
          totalSalidas += movimiento.cantidad;
        }
      }
    });

    return {
      datosPorDia: Object.values(datosPorDia).sort((a, b) => new Date(a.fecha) - new Date(b.fecha)),
      totalEntradas,
      totalSalidas
    };
  };

  const { datosPorDia, totalEntradas, totalSalidas } = procesarDatosMovimientos(movimientos);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) {
      setCurrentYear((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) {
      setCurrentYear((prev) => prev + 1);
    }
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  if (loading) {
    return <Preloader />;
  }

  return (
    <Container maxWidth={false} sx={{ mt: 1, mb: 4, opacity: visible ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
      <Grid container spacing={3}>
        {/* Tarjetas de resumen */}
        <Grid item xs={2} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              height: 130,
              display: "flex",
              borderRadius: 4,
              flexDirection: "column",
              justifyContent: "space-between",
              background: "linear-gradient(135deg, rgb(165, 214, 167) 0%, rgb(76, 175, 80) 100%)",
              color: "white",
              position: "relative",
            }}
          >
            <Box sx={{ position: "absolute", top: 26, left: 16 }}>
              <Typography variant="h6">Ganancia Total</Typography>
              <Typography variant="h5">
                S/{" "}
                {gananciaMensual.length > 0
                  ? parseFloat(
                      gananciaMensual.reduce(
                        (acc, item) =>
                          acc + (item.ganancia_total ? item.ganancia_total : 0),
                        0
                      )
                    ).toFixed(2)
                  : "0.00"}
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgb(165, 214, 167) 0%, rgb(76, 175, 80) 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AttachMoney fontSize="large" />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              height: 130,
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "linear-gradient(135deg, rgb(255, 183, 77) 0%, rgb(255, 152, 0) 100%)",
              color: "white",
              position: "relative",
            }}
          >
            <Box sx={{ position: "absolute", top: 26, left: 16 }}>
              <Typography variant="h6">Productos</Typography>
              <Typography variant="h5">{productos.length}</Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgb(255, 183, 77) 0%, rgb(255, 152, 0) 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Inventory fontSize="large" />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              height: 130,
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "linear-gradient(135deg, rgb(144, 202, 249) 0%, rgb(33, 150, 243) 100%)",
              color: "white",
              position: "relative",
            }}
          >
            <Box sx={{ position: "absolute", top: 26, left: 16 }}>
              <Typography variant="h6">Usuarios</Typography>
              <Typography variant="h5">{usuarios.length}</Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgb(144, 202, 249) 0%, rgb(33, 150, 243) 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <People fontSize="large" />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              height: 130,
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "linear-gradient(135deg, rgb(239, 154, 154) 0%, rgb(244, 67, 54) 100%)",
              color: "white",
              position: "relative",
            }}
          >
            <Box sx={{ position: "absolute", top: 26, left: 16 }}>
              <Typography variant="h6">Movimientos</Typography>
              <Typography variant="h5">{movimientos.length}</Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgb(239, 154, 154) 0%, rgb(244, 67, 54) 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SwapHoriz fontSize="large" />
            </Box>
          </Paper>
        </Grid>

        {/* Gráfico de líneas */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton onClick={handlePrevMonth}>
                <ArrowBack />
              </IconButton>
              <Button variant="outlined" disabled>
                {monthNames[currentMonth]} {currentYear}
              </Button>
              <IconButton onClick={handleNextMonth}>
                <ArrowForward />
              </IconButton>
            </Box>
            <Typography variant="h6" gutterBottom>
              Ventas y Compras de {monthNames[currentMonth]} {currentYear}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={datosPorDia}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="fecha"
                  tickFormatter={(fecha) => new Date(fecha).getDate()} // Mostrar solo el día
                  label={{
                    value: "Días del mes",
                    position: "insideBottom",
                    dy: 10,
                  }}
                />
                <YAxis 
                  label={{
                    value: "Cantidad",
                    angle: -90,
                    position: "insideLeft",
                    dx: -10,
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="entradas"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="salidas" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfico de barras */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom>
              Total entradas y salidas
            </Typography>
            <ResponsiveContainer width="100%" height={355}>
              <BarChart
                data={[
                  { tipo: "Entradas", cantidad: totalEntradas },
                  { tipo: "Salidas", cantidad: totalSalidas }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" />
                <YAxis 
                  domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]} 
                  tickFormatter={(value) => Number(value)} // Convierte a número y evita el "0" al inicio
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfico de pastel */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom>
              Distribución de Productos
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productos}
                  dataKey="stock"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {productos.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Tabla de movimientos */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom>
              Últimos Movimientos
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {movimientos.slice(0, 5).map((movimiento) => (
                    <TableRow key={movimiento.id}>
                      <TableCell>{movimiento.producto_nombre}</TableCell>
                      <TableCell>{movimiento.tipo}</TableCell>
                      <TableCell>{movimiento.cantidad}</TableCell>
                      <TableCell>
                        {new Date(movimiento.fecha).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
