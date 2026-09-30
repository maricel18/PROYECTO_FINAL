import { useState, useEffect } from 'react';

function Reportes({ maquinas = [] }) {
    const [historial, setHistorial] = useState([]);
    const [tarifas, setTarifas] = useState({ tarifaAgua: 0.02, tarifaElectricidad: 1.10 });
    const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
    const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
    const [filtroMaquina, setFiltroMaquina] = useState('Todas');
    const [filtroEvento, setFiltroEvento] = useState('Todos');
    const [cargando, setCargando] = useState(true);

    const cargarDatos = async () => {
        setCargando(true);
        try {
        const [resHistorial, resTarifas] = await Promise.all([
            fetch('http://localhost:8080/api/reportes'),
            fetch('http://localhost:8080/api/tarifas')
        ]);

        const dataHistorial = await resHistorial.json();
        const dataTarifas = await resTarifas.json();

        setHistorial(Array.isArray(dataHistorial) ? dataHistorial : []);
        if (dataTarifas && dataTarifas.tarifaAgua) {
            setTarifas(dataTarifas);
        }
        } catch (error) {
        console.error('Error al cargar datos de reportes:', error);
        } finally {
        setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // Convierte cualquier formato (DD/MM/YYYY o YYYY-MM-DD) a milisegundos para comparar de forma exacta
    const convertirFecha = (strFecha) => {
        if (!strFecha) return null;
        const str = String(strFecha).trim();

        // Formato DD/MM/YYYY
        if (str.includes('/')) {
        const partes = str.split('/');
        if (partes.length === 3) {
            const dia = parseInt(partes[0], 10);
            const mes = parseInt(partes[1], 10) - 1;
            const anio = parseInt(partes[2], 10);
            return new Date(anio, mes, dia).setHours(0, 0, 0, 0);
        }
        }

        // Formato YYYY-MM-DD
        if (str.includes('-')) {
        const partes = str.split('T')[0].split('-');
        if (partes.length === 3) {
            const anio = parseInt(partes[0], 10);
            const mes = parseInt(partes[1], 10) - 1;
            const dia = parseInt(partes[2], 10);
            return new Date(anio, mes, dia).setHours(0, 0, 0, 0);
        }
        }

        const d = new Date(str);
        return isNaN(d.getTime()) ? null : d.setHours(0, 0, 0, 0);
    };

    // Filtrado reactivo en tiempo real
    const historialFiltrado = historial.filter((item) => {
        const cumpleMaquina = filtroMaquina === 'Todas' || item.codigoMaquina === filtroMaquina;
        const cumpleEvento = filtroEvento === 'Todos' || item.evento === filtroEvento;

        let cumpleFecha = true;
        const tiempoItem = convertirFecha(item.fecha);
        const tiempoDesde = convertirFecha(filtroFechaDesde);
        const tiempoHasta = convertirFecha(filtroFechaHasta);

        if (tiempoItem) {
        if (tiempoDesde && tiempoItem < tiempoDesde) {
            cumpleFecha = false;
        }
        if (tiempoHasta && tiempoItem > tiempoHasta) {
            cumpleFecha = false;
        }
        }

        return cumpleMaquina && cumpleEvento && cumpleFecha;
    });

    const totalLitros = parseFloat(
        historialFiltrado.reduce((acc, curr) => acc + (Number(curr.litrosConsumidos) || 0), 0).toFixed(2)
    );
    const totalKwh = parseFloat(
        historialFiltrado.reduce((acc, curr) => acc + (Number(curr.kwhConsumidos) || 0), 0).toFixed(2)
    );

    const costoAgua = parseFloat((totalLitros * (tarifas.tarifaAgua || 0)).toFixed(2));
    const costoLuz = parseFloat((totalKwh * (tarifas.tarifaElectricidad || 0)).toFixed(2));
    const costoTotal = parseFloat((costoAgua + costoLuz).toFixed(2));

    const descargarCSV = () => {
        if (historialFiltrado.length === 0) {
        alert('No hay registros en el rango seleccionado para exportar.');
        return;
        }

        const encabezados = ['ID,Fecha,Maquina,Evento,Detalle,Litros,KWh\n'];
        const filas = historialFiltrado.map(
        (h) => `${h.id},${h.fecha},${h.codigoMaquina},"${h.evento}","${h.detalle}",${h.litrosConsumidos || 0},${h.kwhConsumidos || 0}`
        );

        const bom = '\uFEFF';
        const blob = new Blob([bom + encabezados.concat(filas.join('\n'))], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `bitacora_ecowash_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
        <div className="card shadow-sm border border-secondary border-opacity-25 rounded-3 bg-white mb-4">
            <div className="card-header bg-white py-3 border-bottom">
            <h6 className="mb-0 fw-bold text-dark">Filtros</h6>
            </div>

            <div className="card-body p-4">
            <div className="row g-3 align-items-end">
                <div className="col-md-3">
                <label className="form-label small fw-bold text-secondary">Desde</label>
                <input
                    type="date"
                    className="form-control form-control-sm"
                    value={filtroFechaDesde}
                    onChange={(e) => setFiltroFechaDesde(e.target.value)}
                />
                </div>

                <div className="col-md-3">
                <label className="form-label small fw-bold text-secondary">Hasta</label>
                <input
                    type="date"
                    className="form-control form-control-sm"
                    value={filtroFechaHasta}
                    onChange={(e) => setFiltroFechaHasta(e.target.value)}
                />
                </div>

                <div className="col-md-3">
                <label className="form-label small fw-bold text-secondary">Máquina</label>
                <select
                    className="form-select form-select-sm"
                    value={filtroMaquina}
                    onChange={(e) => setFiltroMaquina(e.target.value)}
                >
                    <option value="Todas">Todas</option>
                    {maquinas.map((m) => (
                    <option key={m.id} value={m.codigo}>
                        {m.codigo}
                    </option>
                    ))}
                </select>
                </div>

                <div className="col-md-3">
                <label className="form-label small fw-bold text-secondary">Tipo de evento</label>
                <select
                    className="form-select form-select-sm"
                    value={filtroEvento}
                    onChange={(e) => setFiltroEvento(e.target.value)}
                >
                    <option value="Todos">Todos</option>
                    <option value="Ciclo de lavado">Ciclo de lavado</option>
                    <option value="Lectura de medidor">Lectura de medidor</option>
                    <option value="Incidencia">Incidencia</option>
                </select>
                </div>
            </div>
            </div>
        </div>

        <div className="card shadow-sm border border-secondary border-opacity-25 rounded-3 bg-white mb-4">
            <div className="card-header bg-white py-3 border-bottom">
            <h6 className="mb-0 fw-bold text-dark">Resultados del historial</h6>
            </div>

            <div className="card-body p-0">
            {cargando ? (
                <div className="p-3 text-secondary small">Cargando eventos...</div>
            ) : (
                <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                    <tr className="small text-secondary">
                        <th>Fecha</th>
                        <th>Máquina</th>
                        <th>Evento</th>
                        <th>Detalle</th>
                    </tr>
                    </thead>
                    <tbody>
                    {historialFiltrado.length === 0 ? (
                        <tr>
                        <td colSpan="4" className="text-center py-3 text-secondary small">
                            No se encontraron registros con los filtros seleccionados.
                        </td>
                        </tr>
                    ) : (
                        historialFiltrado.map((h) => (
                        <tr key={h.id}>
                            <td className="text-secondary small">{h.fecha}</td>
                            <td className="fw-bold text-dark">{h.codigoMaquina}</td>
                            <td>{h.evento}</td>
                            <td className="text-secondary">{h.detalle}</td>
                        </tr>
                        ))
                    )}
                    </tbody>
                </table>
                </div>
            )}
            </div>
        </div>

        <div className="card shadow-sm border border-secondary border-opacity-25 rounded-3 bg-white mb-4">
            <div className="card-header bg-white py-3 border-bottom">
            <h6 className="mb-0 fw-bold text-dark">Resumen de costos (Bs.)</h6>
            </div>

            <div className="card-body p-0">
            <div className="table-responsive">
                <table className="table table-bordered mb-0 align-middle">
                <thead className="table-light">
                    <tr className="small text-secondary">
                    <th>Recurso</th>
                    <th>Consumo total</th>
                    <th>Tarifa</th>
                    <th>Costo (Bs.)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Agua</td>
                    <td>{totalLitros} L</td>
                    <td>Bs. {(tarifas.tarifaAgua || 0).toFixed(2)} / L</td>
                    <td className="fw-semibold">Bs. {costoAgua.toFixed(2)}</td>
                    </tr>
                    <tr>
                    <td>Electricidad</td>
                    <td>{totalKwh} kWh</td>
                    <td>Bs. {(tarifas.tarifaElectricidad || 0).toFixed(2)} / kWh</td>
                    <td className="fw-semibold">Bs. {costoLuz.toFixed(2)}</td>
                    </tr>
                    <tr className="table-light fw-bold">
                    <td colSpan="3">Total estimado</td>
                    <td className="text-dark">Bs. {costoTotal.toFixed(2)}</td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>
        </div>

        <div className="d-flex gap-2">
            <button
            type="button"
            onClick={cargarDatos}
            className="btn btn-sm text-white fw-semibold px-3 py-2"
            style={{ backgroundColor: '#1e485e' }}
            >
            Actualizar datos
            </button>
            <button
            type="button"
            onClick={descargarCSV}
            className="btn btn-sm btn-outline-secondary fw-semibold px-3 py-2"
            >
            Descargar bitácora
            </button>
        </div>
        </div>
    );
}
export default Reportes;