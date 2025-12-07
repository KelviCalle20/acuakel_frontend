import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FileSaver from "file-saver";

import "./estadisticas.css"; // IMPORTANTE

// Colores para gráficos
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Interfaces de datos
interface UsuarioResumen {
  total: number;
  activos: number;
  inactivos: number;
}

interface ProductoResumen {
  total: number;
  activos: number;
  inactivos: number;
}

interface CategoriaResumen {
  total: number;
}

interface PedidoResumen {
  totalPedidos: number;
  totalVentas: number;
}

interface PieChartData {
  [key: string]: string | number;
  name: string;
  value: number;
}

interface BarChartData {
  [key: string]: string | number;
  name: string;
  value: number;
}

export default function Estadisticas() {
  const [usuarios, setUsuarios] = useState<UsuarioResumen>({
    total: 0,
    activos: 0,
    inactivos: 0,
  });

  const [productos, setProductos] = useState<ProductoResumen>({
    total: 0,
    activos: 0,
    inactivos: 0,
  });

  const [categorias, setCategorias] = useState<CategoriaResumen>({
    total: 0,
  });

  const [pedidos, setPedidos] = useState<PedidoResumen>({
    totalPedidos: 0,
    totalVentas: 0,
  });

  const [vista, setVista] = useState<
    "usuarios" | "productos" | "categorias" | "pedidos"
  >("usuarios");

  // ===== USUARIOS =====
  useEffect(() => {
    axios
      .get<UsuarioResumen>("/api/estadisticas/usuarios")
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ===== PRODUCTOS =====
  useEffect(() => {
    axios
      .get<ProductoResumen>("/api/estadisticas/productos")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ===== CATEGORIAS =====
  useEffect(() => {
    axios
      .get<CategoriaResumen>("/api/estadisticas/categorias")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ===== PEDIDOS =====
  useEffect(() => {
    axios
      .get<PedidoResumen>("/api/estadisticas/pedidos")
      .then((res) => setPedidos(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ===== DATA =====
  const pieUsuarios: PieChartData[] = [
    { name: "Activos", value: usuarios.activos },
    { name: "Inactivos", value: usuarios.inactivos },
  ];

  const barUsuarios: BarChartData[] = [
    { name: "Activos", value: usuarios.activos },
    { name: "Inactivos", value: usuarios.inactivos },
  ];

  const pieProductos: PieChartData[] = [
    { name: "Activos", value: productos.activos },
    { name: "Inactivos", value: productos.inactivos },
  ];

  const barPedidos: BarChartData[] = [
    { name: "Pedidos", value: pedidos.totalPedidos },
    { name: "Ventas", value: pedidos.totalVentas },
  ];

  // ===== EXPORTAR =====
  const exportExcelUsuarios = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Estado: "Activos", Cantidad: usuarios.activos },
      { Estado: "Inactivos", Cantidad: usuarios.inactivos },
      { Estado: "Total", Cantidad: usuarios.total },
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    FileSaver.saveAs(blob, "usuarios.xlsx");
  };

  const exportPDFUsuarios = () => {
    const doc = new jsPDF();
    doc.text("Resumen de Usuarios", 14, 20);

    const tableBody = [
      ["Activos", usuarios.activos],
      ["Inactivos", usuarios.inactivos],
      ["Total", usuarios.total],
    ];

    autoTable(doc, {
      head: [["Estado", "Cantidad"]],
      body: tableBody,
      startY: 30,
    });

    doc.save("usuarios.pdf");
  };

  return (
    <div className="stats-layout">
      {/* ===== SIDEBAR ===== */}
      <div className="stats-sidebar">
        <h3>Estadísticas</h3>

        <button onClick={() => setVista("usuarios")}>Usuarios</button>
        <button onClick={() => setVista("productos")}>Productos</button>
        <button onClick={() => setVista("categorias")}>Categorías</button>
        <button onClick={() => setVista("pedidos")}>Pedidos</button>
      </div>

      {/* ===== CONTENIDO ===== */}
      <div className="stats-content">
        {/* ================== USUARIOS ================== */}
        {vista === "usuarios" && (
          <>
            <h2>Usuarios</h2>

            <div className="stats-charts">
              <ResponsiveContainer width={450} height={450}>
                <PieChart>
                  <Pie
                    data={pieUsuarios}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={160}
                    label
                  >
                    {pieUsuarios.map((entry, index) => (
                      <Cell
                        key={entry.name as string}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              <ResponsiveContainer width={650} height={450}>
                <BarChart data={barUsuarios}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="stats-export-buttons">
              <button onClick={exportExcelUsuarios}>Exportar Excel</button>
              <button onClick={exportPDFUsuarios}>Exportar PDF</button>
            </div>
          </>
        )}

        {/* ================== PRODUCTOS ================== */}
        {vista === "productos" && (
          <>
            <h2>Productos</h2>

            <div className="stats-charts">
              <ResponsiveContainer width={500} height={500}>
                <PieChart>
                  <Pie
                    data={pieProductos}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={180}
                    label
                  >
                    {pieProductos.map((entry, index) => (
                      <Cell
                        key={entry.name as string}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* ================== CATEGORÍAS ================== */}
        {vista === "categorias" && (
          <>
            <h2>Categorías</h2>
            <div className="stats-categorias-total">
              Total: {categorias.total}
            </div>
          </>
        )}

        {/* ================== PEDIDOS ================== */}
        {vista === "pedidos" && (
          <>
            <h2>Pedidos</h2>

            <div className="stats-charts">
              <ResponsiveContainer width={700} height={450}>
                <BarChart data={barPedidos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

