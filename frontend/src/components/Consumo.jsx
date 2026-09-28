import { useState, useEffect } from 'react';

function Consumo({ maquinas }) {
    const [consumos, setConsumos] = useState([]);
    const [codigoMaquina, setCodigoMaquina] = useState('');
    const [recurso, setRecurso] = useState('Agua');
    const [valorLeido, setValorLeido] = useState('');
    const [cargando, setCargando] = useState(true);

    const cargarConsumos = async () => {
        try {
        const res = await fetch('http://localhost:8080/api/consumos');
        const data = await res.json();
        setConsumos(data);
        setCargando(false);
        } catch (error) {
        console.error(error);
        setCargando(false);
        }
    };

    useEffect(() => {
        cargarConsumos();
        if (maquinas.length > 0 && !codigoMaquina) {
        setCodigoMaquina(maquinas[0].codigo);
        }
    }, [maquinas]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!valorLeido || !codigoMaquina) return;

        try {
        const res = await fetch('http://localhost:8080/api/consumos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            codigoMaquina,
            recurso,
            valorLeido: parseFloat(valorLeido)
            })
        });

        if (res.ok) {
            setValorLeido('');
            cargarConsumos();
        }
        } catch (error) {
        console.error(error);
        }
    };

    const getSemaforoBadge = (semaforo) => {
        if (semaforo === 'Eficiente') {
        return (
            <span className="d-inline-flex align-items-center gap-1 text-success fw-semibold small">
            <span className="badge rounded-circle bg-success p-1"> </span> Eficiente
            </span>
        );
        }
        if (semaforo === 'Atención') {
        return (
            <span className="d-inline-flex align-items-center gap-1 text-warning fw-semibold small">
            <span className="badge rounded-circle bg-warning p-1"> </span> Atención
            </span>
        );
        }
        return (
        <span className="d-inline-flex align-items-center gap-1 text-danger fw-semibold small">
            <span className="badge rounded-circle bg-danger p-1"> </span> Crítico
        </span>
        );
    };

    const alertas = consumos.filter(c => c.semaforo === 'Crítico' || c.semaforo === 'Atención');

    return (
        <div>
        <div className="card shadow-sm border border-secondary border-opacity-25 rounded-3 bg-white mb-4">
            <div className="card-header bg-white py-3 border-bottom">
            <h6 className="mb-0 fw-bold text-dark">Registrar lectura de medidor</h6>
            </div>

            <div className="card-body p-4">
            <form onSubmit={handleSubmit} className="row g-3 align-items-end">
                <div className="col-md-4">
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

                <div className="col-md-3">
                <label className="form-label small fw-bold text-secondary">Recurso</label>
                <select
                    className="form-select form-select-sm"
                    value={recurso}
                    onChange={(e) => setRecurso(e.target.value)}
                >
                    <option value="Agua">Agua (L)</option>
                    <option value="Electricidad">Electricidad (kWh)</option>
                </select>
                </div>

                <div className="col-md-3">
                <label className="form-label small fw-bold text-secondary">Valor leído</label>
                <input
                    type="number"
                    step="0.1"
                    className="form-control form-control-sm"
                    placeholder={recurso === 'Agua' ? 'Ej. 52' : 'Ej. 1.8'}
                    value={valorLeido}
                    onChange={(e) => setValorLeido(e.target.value)}
                    required
                />
                </div>

                <div className="col-md-2">
                <button
                    type="submit"
                    className="btn btn-sm w-100 text-white fw-semibold"
                    style={{ backgroundColor: '#1e485e' }}
                >
                    Registrar
                </button>
                </div>
            </form>
            </div>
        </div>

        <div className="card shadow-sm border border-secondary border-opacity-25 rounded-3 bg-white mb-4">
            <div className="card-header bg-white py-3 border-bottom">
            <h6 className="mb-0 fw-bold text-dark">Comparación consumo real vs teórico</h6>
            </div>

            <div className="card-body p-0">
            {cargando ? (
                <div className="p-3 text-secondary small">Cargando mediciones...</div>
            ) : (
                <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                    <tr className="small text-secondary">
                        <th>Máquina</th>
                        <th>Recurso</th>
                        <th>Teórico</th>
                        <th>Real</th>
                        <th>Diferencia</th>
                        <th>Semáforo</th>
                    </tr>
                    </thead>
                    <tbody>
                    {consumos.map((item) => (
                        <tr key={item.id}>
                        <td className="fw-bold text-dark">{item.codigoMaquina}</td>
                        <td>{item.recurso}</td>
                        <td>{item.teorico} {item.recurso === 'Agua' ? 'L' : 'kWh'}</td>
                        <td className="fw-semibold">{item.real} {item.recurso === 'Agua' ? 'L' : 'kWh'}</td>
                        <td>
                            <span className={item.diferencia > 0 ? 'text-danger fw-semibold' : 'text-success fw-semibold'}>
                            {item.diferencia > 0 ? `+${item.diferencia}` : item.diferencia} {item.recurso === 'Agua' ? 'L' : 'kWh'}
                            </span>
                        </td>
                        <td>{getSemaforoBadge(item.semaforo)}</td>
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
            <h6 className="mb-0 fw-bold text-dark">Alertas generadas</h6>
            </div>

            <div className="card-body p-3 d-flex flex-column gap-2">
            {alertas.length === 0 ? (
                <div className="text-secondary small">No hay alertas de sobreconsumo activas.</div>
            ) : (
                alertas.map((a) => (
                <div
                    key={a.id}
                    className={`alert mb-0 py-2 small d-flex align-items-center ${
                    a.semaforo === 'Crítico' ? 'alert-danger' : 'alert-warning'
                    }`}
                >
                    <span className={`badge me-2 ${a.semaforo === 'Crítico' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                    ● {a.semaforo}
                    </span>
                    <span>
                    <strong>{a.codigoMaquina}:</strong> diferencia de {a.diferencia} {a.recurso === 'Agua' ? 'L' : 'kWh'} sobre lo esperado {a.semaforo === 'Crítico' && a.recurso === 'Agua' ? '— posible fuga o fallo de electroválvula.' : '— consumo por encima de lo normal.'}
                    </span>
                </div>
                ))
            )}
            </div>
        </div>
        </div>
    );
}
export default Consumo;