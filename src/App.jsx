import { useState } from "react";
import Encabezado from "./components/Encabezado";
import FormularioMaquina from "./components/FormularioMaquina";
import Maquina from "./components/Maquina";

function App() {
  const [maquinas, setMaquinas] = useState([]);

  // Registrar nueva máquina
  const agregarMaquina = (nuevaMaquina) => {
    setMaquinas([...maquinas, nuevaMaquina]);
  };

  // Actualizar estado operativo (RF-07 / CU-07)
  const cambiarEstado = (id, nuevoEstado) => {
    setMaquinas(
      maquinas.map((m) => (m.id === id ? { ...m, estado: nuevoEstado } : m))
    );
  };

  // Eliminar máquina del catálogo
  const eliminarMaquina = (id) => {
    setMaquinas(maquinas.filter((m) => m.id !== id));
  };

  return (
    <div className="container py-4" style={{ maxWidth: "960px" }}>
      {/* 1. Encabezado con props dinámicas */}
      <Encabezado
        titulo="EcoWash - Lavandería Autoservicio"
        subtitulo="Control Operativo de Equipos y Monitoreo de Recursos"
      />

      {/* 2. Formulario: recibe la lista maquinas para validar duplicados */}
      <FormularioMaquina agregarMaquina={agregarMaquina} maquinas={maquinas} />

      {/* 3. Catálogo operativo y listado */}
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25 pb-2 mb-3">
          <h4 className="fw-bold text-dark mb-0">Catálogo de Maquinaria Operativa</h4>
          <span className="badge bg-dark text-white rounded-pill px-3 py-2">
            Máquinas en sistema: {maquinas.length}
          </span>
        </div>

        {/* Renderizado condicional */}
        {maquinas.length === 0 ? (
          <div
            className="alert alert-secondary text-center py-4 rounded-3 border-secondary border-opacity-25 shadow-sm"
            role="alert"
          >
            <p className="mb-0 text-secondary fw-semibold">
              No existen máquinas registradas en el catálogo operativo.
            </p>
          </div>
        ) : (
          <div className="row">
            {maquinas.map((item) => (
              <Maquina
                key={item.id}
                id={item.id}
                codigo={item.codigo}
                tipo={item.tipo}
                marca={item.marca}
                modelo={item.modelo}
                capacidadKg={item.capacidadKg}
                litrosAgua={item.litrosAgua}
                consumoKwh={item.consumoKwh}
                estado={item.estado}
                cambiarEstado={cambiarEstado}
                eliminarMaquina={eliminarMaquina}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default App;