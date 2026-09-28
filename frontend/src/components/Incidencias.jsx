import { useState, useEffect } from 'react';

function Incidencias({ maquinas }) {
    const [incidencias, setIncidencias] = useState([]);
    const [codigoMaquina, setCodigoMaquina] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [cargando, setCargando] = useState(true);

    const cargarIncidencias = async () => {
        try {
        const res = await fetch('http://localhost:8080/api/incidencias');
        const data = await res.json();
        setIncidencias(data);
        setCargando(false);
        } catch (error) {
        console.error(error);
        setCargando(false);
        }
    };

    useEffect(() => {
        cargarIncidencias();
        if (maquinas.length > 0 && !codigoMaquina) {
        setCodigoMaquina(maquinas[0].codigo);
        }
    }, [maquinas]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!descripcion.trim() || !codigoMaquina) return;

        try {
        const res = await fetch('http://localhost:8080/api/incidencias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            codigoMaquina,
            descripcion
            })
        });

        if (res.ok) {
            setDescripcion('');
            cargarIncidencias();
        }
        } catch (error) {
        console.error(error);
        }
    };

    const cerrarIncidencia = async (id) => {
        try {
        const res = await fetch(`http://localhost:8080/api/incidencias/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'Cerrada' })
        });

        if (res.ok) {
            setIncidencias(incidencias.map(inc => inc.id === id ? { ...inc, estado: 'Cerrada' } : inc));
        }
        } catch (error) {
        console.error(error);
        }
    };

    return (
        <div>
        <div className="card shadow-sm border border-secondary border-opacity-25 rounded-3 bg-white mb-4">
            <div className="card-header bg-white py-3 border-bottom">
            <h6 className="mb-0 fw-bold text-dark">Incidencias registradas</h6>
            </div>

            <div className="card-body p-0">
            {cargando ? (
                <div className="p-3 text-secondary small">Cargando incidencias...</div>
            ) : (
                <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                    <tr className="small text-secondary">
                        <th>Máquina</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {incidencias.map((item) => (
                        <tr key={item.id}>
                        <td className="fw-bold text-dark">{item.codigoMaquina}</td>
                        <td>{item.descripcion}</td>
                        <td>
                            <span
                            className={`badge rounded-pill px-3 py-1 fw-semibold small ${
                                item.estado === 'Abierta'
                                ? 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25'
                                : 'bg-success bg-opacity-10 text-success border border-success border-opacity-25'
                            }`}
                            >
                            {item.estado}
                            </span>
                        </td>
                        <td className="text-secondary small">{item.fecha}</td>
                        <td className="text-center">
                            {item.estado === 'Abierta' ? (
                            <button
                                onClick={() => cerrarIncidencia(item.id)}
                                className="btn btn-outline-secondary btn-sm px-3"
                            >
                                ✓ Cerrar
                            </button>
                            ) : (
                            <span className="text-muted small">Resuelto</span>
                            )}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div>
        </div>

        <div className="card shadow-sm border border-secondary border-opacity-25 rounded-3 bg-white">
            <div className="card-header bg-white py-3 border-bottom">
            <h6 className="mb-0 fw-bold text-dark">Registrar nueva incidencia</h6>
            </div>

            <div className="card-body p-4">
            <form onSubmit={handleSubmit} className="row g-3 align-items-end">
                <div className="col-md-3">
                <label className="form-label small fw-bold text-secondary">Máquina</label>
                <select
                    className="form-select form-select-sm"
                    value={codigoMaquina}
                    onChange={(e) => setCodigoMaquina(e.target.value)}
                    required
                >
                    {maquinas.map((m) => (
                    <option key={m.id} value={m.codigo}>
                        {m.codigo} — {m.tipo}
                    </option>
                    ))}
                </select>
                </div>

                <div className="col-md-7">
                <label className="form-label small fw-bold text-secondary">Descripción</label>
                <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Describir el problema técnico detectado..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                />
                </div>

                <div className="col-md-2">
                <button
                    type="submit"
                    className="btn btn-sm w-100 text-white fw-semibold"
                    style={{ backgroundColor: '#1e485e' }}
                >
                    + Registrar incidencia
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    );
}
export default Incidencias;