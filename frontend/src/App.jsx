import { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FormularioMaquina from './components/FormularioMaquina';
import Maquina from './components/Maquina';
import Empleados from './components/Empleados';
import Tarifas from './components/Tarifas';
import Consumo from './components/Consumo';
import Incidencias from './components/Incidencias';
import Reportes from './components/Reportes';

function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(() => {
    const sesionGuardada = sessionStorage.getItem('usuarioEcoWash');
    return sesionGuardada ? JSON.parse(sesionGuardada) : null;
  });

  const [vistaActual, setVistaActual] = useState('dashboard');
  const [maquinas, setMaquinas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarMaquinas = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/maquinas');
      const data = await res.json();
      setMaquinas(data);
      setCargando(false);
    } catch (error) {
      console.error(error);
      setCargando(false);
    }
  };

  useEffect(() => {
    if (usuarioActivo) {
      cargarMaquinas();
    }
  }, [usuarioActivo]);

  const handleCerrarSesion = () => {
    sessionStorage.removeItem('usuarioEcoWash');
    setUsuarioActivo(null);
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`http://localhost:8080/api/maquinas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (res.ok) {
        setMaquinas(maquinas.map((m) => (m.id === id ? { ...m, estado: nuevoEstado } : m)));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarMaquina = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta máquina?')) return;

    try {
      const res = await fetch(`http://localhost:8080/api/maquinas/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setMaquinas(maquinas.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!usuarioActivo) {
    return <Login onLoginExitoso={(usuario) => setUsuarioActivo(usuario)} />;
  }

  const esAdmin = usuarioActivo.rol === 'Administrador';

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar 
        vistaActual={vistaActual} 
        setVistaActual={setVistaActual} 
        onCerrarSesion={handleCerrarSesion}
        usuarioActivo={usuarioActivo}
      />

      <main className="flex-grow-1 p-4" style={{ overflowY: 'auto', maxHeight: '100vh' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <h4 className="fw-bold text-dark mb-0">
            {vistaActual === 'dashboard' && 'Dashboard General'}
            {vistaActual === 'empleados' && 'Gestión de Empleados y Roles'}
            {vistaActual === 'maquinas' && 'Gestión de Máquinas'}
            {vistaActual === 'consumo' && 'Monitoreo de Consumo'}
            {vistaActual === 'tarifas' && 'Configuración de Tarifas'}
            {vistaActual === 'incidencias' && 'Gestión de Incidencias'}
            {vistaActual === 'reportes' && 'Reportes e Historial'}
          </h4>
          <div className="text-secondary small">
            Sesión: <strong className="text-dark">{usuarioActivo.nombre}</strong> ({usuarioActivo.rol})
          </div>
        </div>

        {vistaActual === 'dashboard' && (
          <Dashboard maquinas={maquinas} usuarioActivo={usuarioActivo} />
        )}

        {vistaActual === 'empleados' && esAdmin && (
          <Empleados />
        )}

        {vistaActual === 'tarifas' && esAdmin && (
          <Tarifas />
        )}

        {vistaActual === 'consumo' && (
          <Consumo maquinas={maquinas} />
        )}

        {vistaActual === 'incidencias' && (
          <Incidencias maquinas={maquinas} />
        )}

        {vistaActual === 'reportes' && (
          <Reportes maquinas={maquinas} />
        )}

        {vistaActual === 'maquinas' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-semibold text-secondary mb-0">Catálogo de las Máquinas — EcoWash</h5>
              <span className="badge bg-dark px-3 py-2">
                Total registradas: {maquinas.length}
              </span>
            </div>

            {esAdmin && (
              <FormularioMaquina onMaquinaAgregada={cargarMaquinas} />
            )}

            {cargando ? (
              <div className="alert alert-info">Cargando catálogo desde SQL Server...</div>
            ) : (
              <div className="row">
                {maquinas.map((m) => (
                  <Maquina
                    key={m.id}
                    id={m.id}
                    codigo={m.codigo}
                    tipo={m.tipo}
                    marca={m.marca}
                    modelo={m.modelo}
                    capacidadKg={m.capacidadKg}
                    litrosAgua={m.litrosAgua}
                    consumoKwh={m.consumoKwh}
                    estado={m.estado}
                    cambiarEstado={cambiarEstado}
                    eliminarMaquina={esAdmin ? eliminarMaquina : null}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
export default App;