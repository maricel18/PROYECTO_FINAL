import { useState } from "react";

function FormularioMaquina({ agregarMaquina, maquinas = [] }) {
  // Estados para los campos técnicos (RF-05 y RF-06)
    const [codigo, setCodigo] = useState("");
    const [tipo, setTipo] = useState("");
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [capacidadKg, setCapacidadKg] = useState("");
    const [litrosAgua, setLitrosAgua] = useState("");
    const [consumoKwh, setConsumoKwh] = useState("");
    const [estado, setEstado] = useState("Disponible");

    // Estados de retroalimentación
    const [mensajeError, setMensajeError] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setMensajeError("");
        setMensajeExito("");

        const codigoFormateado = codigo.trim().toUpperCase();
        const capacidadNum = Number(capacidadKg);
        const litrosNum = Number(litrosAgua);
        const kwhNum = Number(consumoKwh);

        // 1. Validación de código duplicado (Unicidad de identificador RF-05)
        const codigoExistente = maquinas.some(
        (m) => m.codigo.trim().toUpperCase() === codigoFormateado
        );

        if (codigoExistente) {
        setMensajeError(`El código "${codigoFormateado}" ya se encuentra registrado. Utilice un código correlativo (ej. LAV-02, SEC-02).`);
        return;
        }

        // 2. Validación de campos obligatorios y tipos de datos numéricos
        const esCapacidadValida =
        capacidadKg.trim() !== "" &&
        !isNaN(capacidadNum) &&
        capacidadNum > 0 &&
        Number.isInteger(capacidadNum);

        const sonLitrosValidos =
        litrosAgua.trim() !== "" &&
        !isNaN(litrosNum) &&
        litrosNum >= 0 &&
        Number.isInteger(litrosNum);

        const esKwhValido =
        consumoKwh.trim() !== "" &&
        !isNaN(kwhNum) &&
        kwhNum > 0;

        if (
        !codigoFormateado ||
        !tipo ||
        !marca.trim() ||
        !modelo.trim() ||
        !esCapacidadValida ||
        !sonLitrosValidos ||
        !esKwhValido
        ) {
        setMensajeError("Complete correctamente todos los datos técnicos de la máquina.");
        return;
        }

        // Objeto listo para almacenar en el estado central
        const nuevaMaquina = {
        id: Date.now(),
        codigo: codigoFormateado,
        tipo,
        marca: marca.trim(),
        modelo: modelo.trim(),
        capacidadKg: parseInt(capacidadKg, 10),
        litrosAgua: parseInt(litrosAgua, 10),
        consumoKwh: parseFloat(kwhNum.toFixed(2)),
        estado,
        };

        agregarMaquina(nuevaMaquina);

        // Mensaje de confirmación y limpieza de campos
        setMensajeExito(`Máquina "${codigoFormateado}" registrada exitosamente en el catálogo.`);
        setCodigo("");
        setTipo("");
        setMarca("");
        setModelo("");
        setCapacidadKg("");
        setLitrosAgua("");
        setConsumoKwh("");
        setEstado("Disponible");
    };

    return (
        <div className="card shadow-sm border border-secondary border-opacity-25 mb-4 bg-white">
        <div className="card-header bg-dark text-white py-3 text-center border-bottom border-secondary border-opacity-25">
            <h5 className="mb-0 fw-semibold">
            <i className="bi bi-gear-wide-connected me-2"></i>Registrar Maquinaria (Catálogo)
            </h5>
        </div>

        <div className="card-body p-4">
            {mensajeError && (
            <div className="alert alert-danger py-2 border-danger border-opacity-25 text-center" role="alert">
                {mensajeError}
            </div>
            )}
            {mensajeExito && (
            <div className="alert alert-success py-2 border-success border-opacity-25 text-center" role="alert">
                {mensajeExito}
            </div>
            )}

            <form onSubmit={handleSubmit}>
            <div className="row g-3">
                <div className="col-md-3">
                <label className="form-label text-dark fw-semibold small">Código:</label>
                <input
                    type="text"
                    className="form-control border-secondary border-opacity-25"
                    placeholder="Ej. LAV-01"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                />
                </div>

                <div className="col-md-3">
                <label className="form-label text-dark fw-semibold small">Tipo:</label>
                <select
                    className="form-select border-secondary border-opacity-25"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                >
                    <option value="">Seleccione...</option>
                    <option value="Lavadora">Lavadora</option>
                    <option value="Secadora">Secadora</option>
                </select>
                </div>

                <div className="col-md-3">
                <label className="form-label text-dark fw-semibold small">Marca:</label>
                <input
                    type="text"
                    className="form-control border-secondary border-opacity-25"
                    placeholder="Ej. Speed Queen"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                />
                </div>

                <div className="col-md-3">
                <label className="form-label text-dark fw-semibold small">Modelo:</label>
                <input
                    type="text"
                    className="form-control border-secondary border-opacity-25"
                    placeholder="Ej. Pro Series"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                />
                </div>

                <div className="col-md-4">
                <label className="form-label text-dark fw-semibold small">Capacidad (Kg):</label>
                <input
                    type="number"
                    step="1"
                    min="1"
                    className="form-control border-secondary border-opacity-25"
                    placeholder="Entero mayor a 0"
                    value={capacidadKg}
                    onChange={(e) => setCapacidadKg(e.target.value)}
                />
                </div>

                <div className="col-md-4">
                <label className="form-label text-dark fw-semibold small">Agua teórica (Litros/ciclo):</label>
                <input
                    type="number"
                    step="1"
                    min="0"
                    className="form-control border-secondary border-opacity-25"
                    placeholder="0 si es secadora"
                    value={litrosAgua}
                    onChange={(e) => setLitrosAgua(e.target.value)}
                />
                </div>

                <div className="col-md-4">
                <label className="form-label text-dark fw-semibold small">Consumo teórico (kWh/ciclo):</label>
                <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    className="form-control border-secondary border-opacity-25"
                    placeholder="Ej. 1.5"
                    value={consumoKwh}
                    onChange={(e) => setConsumoKwh(e.target.value)}
                />
                </div>

                <div className="col-md-12">
                <label className="form-label text-dark fw-semibold small">Estado Operativo:</label>
                <select
                    className="form-select border-secondary border-opacity-25"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                >
                    <option value="Disponible">Disponible</option>
                    <option value="En Ciclo">En Ciclo</option>
                    <option value="En Mantenimiento">En Mantenimiento</option>
                    <option value="Fuera de Servicio">Fuera de Servicio</option>
                </select>
                </div>

                <div className="col-12 mt-4">
                <button type="submit" className="btn btn-dark w-100 py-2 fw-semibold shadow-sm">
                    Registrar Máquina en Catálogo
                </button>
                </div>
            </div>
            </form>
        </div>
        </div>
    );
}
export default FormularioMaquina;