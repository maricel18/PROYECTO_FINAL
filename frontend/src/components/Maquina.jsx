function Maquina({ id, codigo, tipo, marca, modelo, capacidadKg, litrosAgua, consumoKwh, estado, cambiarEstado, eliminarMaquina }) {
    const getStatusBadge = () => {
        switch (estado) {
        case "Disponible":
            return "bg-success bg-opacity-10 text-success border border-success border-opacity-25";
        case "En Ciclo":
            return "bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25";
        case "En Mantenimiento":
            return "bg-warning bg-opacity-10 text-dark border border-warning border-opacity-50";
        case "Fuera de Servicio":
            return "bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25";
        default:
            return "bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25";
        }
    };

    return (
        <div className="col-md-6 col-lg-4 mb-4">
        <div className="card h-100 border border-secondary border-opacity-25 shadow-sm rounded-3 bg-white">
            
            <div className="p-3 border-bottom border-light-subtle d-flex justify-content-between align-items-center bg-light">
            <div className="d-flex align-items-center gap-2">
                <span className="badge bg-dark text-white fw-bold px-2 py-1 font-monospace">
                {codigo}
                </span>
                <span className="text-secondary small fw-medium">
                {tipo}
                </span>
            </div>

            <span className={`badge rounded-pill px-3 py-1 fw-semibold small ${getStatusBadge()}`}>
                {estado}
            </span>
            </div>

            <div className="card-body p-3">
            <div className="mb-3">
                <h5 className="fw-bold text-dark mb-0 tracking-wide text-uppercase" style={{ letterSpacing: "0.5px" }}>
                {marca}
                </h5>
                <span className="text-secondary small">
                {modelo} &bull; <strong className="text-dark">{capacidadKg} kg de carga</strong>
                </span>
            </div>

            <div className="rounded-3 p-3 bg-light border border-secondary border-opacity-10 mb-3">
                <div className="d-flex align-items-center justify-content-between py-1 border-bottom border-secondary border-opacity-10">
                <span className="text-secondary small">Agua por ciclo</span>
                <span className="fw-bold font-monospace text-dark small">
                    {litrosAgua} <span className="fw-normal text-secondary">L</span>
                </span>
                </div>

                <div className="d-flex align-items-center justify-content-between py-1 pt-2">
                <span className="text-secondary small">Consumo energía</span>
                <span className="fw-bold font-monospace text-dark small">
                    {consumoKwh} <span className="fw-normal text-secondary">kWh</span>
                </span>
                </div>
            </div>

            <div className="d-flex gap-2 align-items-center">
                <select
                className="form-select form-select-sm border-secondary border-opacity-25 small"
                value={estado}
                onChange={(e) => cambiarEstado(id, e.target.value)}
                >
                <option value="Disponible">Disponible</option>
                <option value="En Ciclo">En Ciclo</option>
                <option value="En Mantenimiento">En Mantenimiento</option>
                <option value="Fuera de Servicio">Fuera de Servicio</option>
                </select>
                <button
                className="btn btn-outline-danger btn-sm px-2"
                title="Eliminar máquina"
                onClick={() => eliminarMaquina(id)}
                >
                <i className="bi bi-trash"></i>
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}
export default Maquina;