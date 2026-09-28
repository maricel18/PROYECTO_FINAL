function Dashboard({ maquinas, usuarioActivo }) {
    const disponibles = maquinas.filter(m => m.estado === 'Disponible').length;
    const enCiclo = maquinas.filter(m => m.estado === 'En Ciclo' || m.estado === 'En Uso').length;
    const fueraServicio = maquinas.filter(m => m.estado === 'Fuera de Servicio' || m.estado === 'Mantenimiento').length;
    const incidenciasAbiertas = fueraServicio;

    const maquinasCriticas = maquinas.filter(m => m.estado === 'Fuera de Servicio' || m.estado === 'Mantenimiento');
    const maquinasEnUso = maquinas.filter(m => m.estado === 'En Ciclo' || m.estado === 'En Uso');

    return (
        <div>
        <div className="row g-3 mb-4">
            <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center py-3 bg-white rounded-3">
                <i className="bi bi-check2-circle fs-3 text-success mb-1"></i>
                <h2 className="fw-bold text-dark mb-0">{disponibles}</h2>
                <span className="text-secondary small text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                Disponibles
                </span>
            </div>
            </div>

            <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center py-3 bg-white rounded-3">
                <i className="bi bi-arrow-repeat fs-3 text-primary mb-1"></i>
                <h2 className="fw-bold text-dark mb-0">{enCiclo}</h2>
                <span className="text-secondary small text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                En Ciclo / Uso
                </span>
            </div>
            </div>

            <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center py-3 bg-white rounded-3">
                <i className="bi bi-tools fs-3 text-warning mb-1"></i>
                <h2 className="fw-bold text-dark mb-0">{fueraServicio}</h2>
                <span className="text-secondary small text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                Fuera de Servicio
                </span>
            </div>
            </div>

            <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center py-3 bg-white rounded-3">
                <i className="bi bi-exclamation-triangle fs-3 text-danger mb-1"></i>
                <h2 className="fw-bold text-dark mb-0">{incidenciasAbiertas}</h2>
                <span className="text-secondary small text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                Incidencias Reportadas
                </span>
            </div>
            </div>
        </div>

        <div className="card border-0 shadow-sm mb-4 rounded-3">
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold text-dark">
                <i className="bi bi-bell me-2"></i>Monitoreo de Alertas en Tiempo Real
            </h6>
            <span className="badge bg-secondary">
                {maquinasCriticas.length + (maquinasEnUso.length > 0 ? 1 : 0)} alertas activas
            </span>
            </div>
            
            <div className="card-body p-3 d-flex flex-column gap-2">
            {maquinasCriticas.length > 0 ? (
                maquinasCriticas.map((maq) => (
                <div key={maq.id} className="alert alert-danger mb-0 py-2 small d-flex align-items-center">
                    <span className="badge bg-danger me-2">● Atención Requerida</span>
                    <span>
                    <strong>{maq.codigo} ({maq.tipo})</strong> — Estado operativo marcado como <em>{maq.estado}</em>. Requiere revisión técnica o mantenimiento de componentes.
                    </span>
                </div>
                ))
            ) : (
                <div className="alert alert-success mb-0 py-2 small d-flex align-items-center">
                <span className="badge bg-success me-2">● Todo Operativo</span>
                <span>Ninguna máquina reporta averías o fuera de servicio actualmente.</span>
                </div>
            )}

            {maquinasEnUso.map((maq) => (
                <div key={maq.id} className="alert alert-warning mb-0 py-2 small d-flex align-items-center">
                <span className="badge bg-warning text-dark me-2">● En Operación</span>
                <span>
                    <strong>{maq.codigo}</strong> — Ciclo activo ({maq.capacidadKg} kg). Consumo estimado en progreso ({maq.consumoKwh} kWh).
                </span>
                </div>
            ))}

            {disponibles > 0 && (
                <div className="alert alert-success mb-0 py-2 small d-flex align-items-center">
                <span className="badge bg-success me-2">● Disponible</span>
                <span>{disponibles} unidad(es) listas para iniciar nuevos ciclos de lavado o secado.</span>
                </div>
            )}
            </div>
        </div>
        </div>
    );
}
export default Dashboard;