import { useState, useEffect } from 'react';

function Tarifas() {
    const [tarifaAgua, setTarifaAgua] = useState('');
    const [tarifaElectricidad, setTarifaElectricidad] = useState('');
    const [fechaActualizacion, setFechaActualizacion] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(true);

    const cargarTarifas = async () => {
        try {
        const res = await fetch('http://localhost:8080/api/tarifas');
        const data = await res.json();
        setTarifaAgua(data.tarifaAgua);
        setTarifaElectricidad(data.tarifaElectricidad);
        setFechaActualizacion(data.fechaActualizacion);
        setCargando(false);
        } catch (error) {
        console.error(error);
        setCargando(false);
        }
    };

    useEffect(() => {
        cargarTarifas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');

        try {
        const res = await fetch('http://localhost:8080/api/tarifas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            tarifaAgua: parseFloat(tarifaAgua),
            tarifaElectricidad: parseFloat(tarifaElectricidad)
            })
        });

        if (res.ok) {
            const data = await res.json();
            setFechaActualizacion(data.fechaActualizacion);
            setMensaje('Tarifas actualizadas correctamente.');
        } else {
            setMensaje('Error al guardar las tarifas.');
        }
        } catch (error) {
        console.error(error);
        setMensaje('No se pudo conectar con el servidor.');
        }
    };

    return (
        <div className="card shadow-sm border border-secondary border-opacity-25 rounded-3 bg-white" style={{ maxWidth: '650px' }}>
        <div className="card-header bg-white py-3 border-bottom">
            <h5 className="mb-0 fw-bold text-dark">Configuración de Tarifas</h5>
        </div>

        <div className="card-body p-4">
            {mensaje && (
            <div className="alert alert-success py-2 small mb-3">
                {mensaje}
            </div>
            )}

            {cargando ? (
            <div className="alert alert-info py-2 small">Cargando tarifas...</div>
            ) : (
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">
                    Tarifa de agua (Bs. por litro)
                </label>
                <input
                    type="number"
                    step="0.001"
                    className="form-control"
                    value={tarifaAgua}
                    onChange={(e) => setTarifaAgua(e.target.value)}
                    required
                />
                </div>

                <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">
                    Tarifa de electricidad (Bs. por kWh)
                </label>
                <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={tarifaElectricidad}
                    onChange={(e) => setTarifaElectricidad(e.target.value)}
                    required
                />
                </div>

                <div className="text-secondary small mb-4">
                Última actualización: <strong>{fechaActualizacion}</strong>
                </div>

                <button
                type="submit"
                className="btn text-white fw-semibold px-4 py-2"
                style={{ backgroundColor: '#1e485e' }}
                >
                Guardar tarifas
                </button>
            </form>
            )}
        </div>
        </div>
    );
}
export default Tarifas;