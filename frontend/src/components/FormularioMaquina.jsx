import { useState } from 'react';

function FormularioMaquina({ onMaquinaAgregada }) {
    const [formData, setFormData] = useState({
        codigo: '',
        tipo: 'Lavadora Estándar',
        marca: '',
        modelo: '',
        capacidadKg: '',
        litrosAgua: '', 
        consumoKwh: '',
        estado: 'Disponible'
    });

    const [guardando, setGuardando] = useState(false);
    const [errorValidacion, setErrorValidacion] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrorValidacion(''); 

        setFormData((prev) => {
        const updated = { ...prev, [name]: value };

        if (name === 'tipo') {
            if (value.includes('Secadora')) {
            updated.litrosAgua = '0';
            } else if (prev.litrosAgua === '0') {
            updated.litrosAgua = '';
            }
        }

        return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorValidacion('');

        if (!formData.codigo || !formData.capacidadKg) {
        setErrorValidacion('Por favor completa el código y la capacidad.');
        return;
        }

        const esSecadora = formData.tipo.includes('Secadora');
        const litrosAguaNum = formData.litrosAgua !== '' ? parseFloat(formData.litrosAgua) : (esSecadora ? 0 : null);

        if (esSecadora && litrosAguaNum > 0) {
        setErrorValidacion('Error de validación: Una secadora no puede consumir agua (el valor debe ser estrictamente 0 L).');
        return;
        }

        if (!esSecadora && (litrosAguaNum === null || isNaN(litrosAguaNum))) {
        setErrorValidacion('Por favor ingresa los litros de agua por ciclo para la lavadora.');
        return;
        }

        setGuardando(true);

        try {
        const res = await fetch('http://localhost:8080/api/maquinas', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            codigo: formData.codigo.trim(),
            tipo: formData.tipo,
            marca: formData.marca.trim() || 'ECOWASH',
            modelo: formData.modelo.trim() || 'Estándar',
            capacidadKg: parseFloat(formData.capacidadKg),
            litrosAgua: esSecadora ? 0 : litrosAguaNum,
            consumoKwh: formData.consumoKwh !== '' ? parseFloat(formData.consumoKwh) : 1.2,
            estado: formData.estado
            })
        });

        const data = await res.json();

        if (res.ok) {
            setFormData({
            codigo: '',
            tipo: 'Lavadora Estándar',
            marca: '',
            modelo: '',
            capacidadKg: '',
            litrosAgua: '',
            consumoKwh: '',
            estado: 'Disponible'
            });

            if (onMaquinaAgregada) {
            onMaquinaAgregada();
            }
        } else {
            setErrorValidacion('Error del servidor: ' + (data.mensaje || 'No se pudo registrar'));
        }
        } catch (error) {
        console.error('Error al registrar maquinaria:', error);
        setErrorValidacion('No se pudo establecer conexión con el servidor backend.');
        } finally {
        setGuardando(false);
        }
    };

    const esSecadoraSeleccionada = formData.tipo.includes('Secadora');

    return (
        <div className="card shadow-sm border border-secondary border-opacity-25 rounded-3 mb-4 bg-white">
        <div className="card-header bg-dark text-white py-3">
            <h5 className="mb-0 fw-semibold text-center tracking-wide">
            Registrar Maquinaria (Catálogo)
            </h5>
        </div>

        <div className="card-body p-4">
            {errorValidacion && (
            <div className="alert alert-danger py-2 small mb-3">
                {errorValidacion}
            </div>
            )}

            <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
                <div className="col-md-3">
                <label className="form-label small fw-bold text-secondary">Código:</label>
                <input
                    type="text"
                    name="codigo"
                    className="form-control"
                    placeholder="Ej. SEC-02"
                    value={formData.codigo}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className="col-md-3">
                <label className="form-label small fw-bold text-secondary">Tipo:</label>
                <select
                    name="tipo"
                    className="form-select"
                    value={formData.tipo}
                    onChange={handleChange}
                >
                    <option value="Lavadora Estándar">Lavadora Estándar</option>
                    <option value="Lavadora Industrial">Lavadora Industrial</option>
                    <option value="Secadora a Gas">Secadora a Gas</option>
                    <option value="Secadora Eléctrica">Secadora Eléctrica</option>
                    <option value="Torre / Centro Lavado">Torre / Centro Lavado</option>
                </select>
                </div>

                <div className="col-md-3">
                <label className="form-label small fw-bold text-secondary">Marca:</label>
                <input
                    type="text"
                    name="marca"
                    className="form-control"
                    placeholder="Ej. Whirlpool, Speed Queen"
                    value={formData.marca}
                    onChange={handleChange}
                />
                </div>

                <div className="col-md-3">
                <label className="form-label small fw-bold text-secondary">Modelo:</label>
                <input
                    type="text"
                    name="modelo"
                    className="form-control"
                    placeholder="Ej. Heavy Duty Pro"
                    value={formData.modelo}
                    onChange={handleChange}
                />
                </div>
            </div>

            <div className="row g-3 mb-3">
                <div className="col-md-4">
                <label className="form-label small fw-bold text-secondary">Capacidad (Kg):</label>
                <input
                    type="number"
                    step="0.1"
                    name="capacidadKg"
                    className="form-control"
                    placeholder="Ej. 12"
                    value={formData.capacidadKg}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className="col-md-4">
                <label className="form-label small fw-bold text-secondary">
                    Agua teórica (Litros/ciclo):
                </label>
                <input
                    type="number"
                    step="0.1"
                    name="litrosAgua"
                    className="form-control"
                    placeholder={esSecadoraSeleccionada ? "0 (Secadora no consume agua)" : "Ej. 45"}
                    value={formData.litrosAgua}
                    onChange={handleChange}
                    disabled={esSecadoraSeleccionada} // Bloqueado en 0 si es secadora
                />
                <div className="form-text small" style={{ fontSize: '0.75rem' }}>
                    {esSecadoraSeleccionada 
                    ? "Bloqueado en 0 L (los ciclos de secado no consumen agua)" 
                    : "Consumo estimado según el tamaño de la tina"}
                </div>
                </div>

                <div className="col-md-4">
                <label className="form-label small fw-bold text-secondary">Consumo teórico (kWh/ciclo):</label>
                <input
                    type="number"
                    step="0.1"
                    name="consumoKwh"
                    className="form-control"
                    placeholder="Ej. 1.5"
                    value={formData.consumoKwh}
                    onChange={handleChange}
                />
                </div>
            </div>

            <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">Estado Operativo:</label>
                <select
                name="estado"
                className="form-select"
                value={formData.estado}
                onChange={handleChange}
                >
                <option value="Disponible">Disponible</option>
                <option value="En Uso">En Uso</option>
                <option value="En Ciclo">En Ciclo</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Fuera de Servicio">Fuera de Servicio</option>
                </select>
            </div>

            <button
                type="submit"
                className="btn btn-dark w-100 py-2 fw-semibold"
                disabled={guardando}
            >
                {guardando ? 'Guardando en Base de Datos...' : 'Registrar Máquina en Catálogo'}
            </button>
            </form>
        </div>
        </div>
    );
}
export default FormularioMaquina;