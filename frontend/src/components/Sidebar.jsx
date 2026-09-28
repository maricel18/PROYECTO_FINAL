function Sidebar({ vistaActual, setVistaActual, onCerrarSesion, usuarioActivo }) {
    const todosLosItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', soloAdmin: false },
        { id: 'empleados', label: 'Empleados y Roles', icon: 'bi-people', soloAdmin: true },
        { id: 'maquinas', label: 'Máquinas', icon: 'bi-gear', soloAdmin: false },
        { id: 'consumo', label: 'Consumo', icon: 'bi-water', soloAdmin: false },
        { id: 'tarifas', label: 'Tarifas', icon: 'bi-cash-coin', soloAdmin: true },
        { id: 'incidencias', label: 'Incidencias', icon: 'bi-exclamation-triangle', soloAdmin: false },
        { id: 'reportes', label: 'Reportes', icon: 'bi-bar-chart-line', soloAdmin: false },
    ];

    const esAdmin = usuarioActivo?.rol === 'Administrador';
    const menuVisible = todosLosItems.filter(item => !item.soloAdmin || esAdmin);

    return (
        <div 
        className="d-flex flex-column flex-shrink-0 text-white min-vh-100 p-3"
        style={{ width: '250px', backgroundColor: '#1e485e' }}
        >
        <div className="d-flex align-items-center mb-4 px-2 text-white text-decoration-none">
            <i className="bi bi-droplet-fill me-2 fs-4 text-info"></i>
            <span className="fs-5 fw-bold tracking-wide">EcoWash</span>
        </div>

        <hr className="border-secondary border-opacity-50 my-1 mb-3" />

        <ul className="nav nav-pills flex-column mb-auto gap-1">
            {menuVisible.map((item) => {
            const esActivo = vistaActual === item.id;
            return (
                <li className="nav-item" key={item.id}>
                <button
                    type="button"
                    onClick={() => setVistaActual(item.id)}
                    className={`nav-link text-start w-100 d-flex align-items-center py-2 px-3 rounded-2 border-0 ${
                    esActivo 
                        ? 'active fw-bold' 
                        : 'text-white-50'
                    }`}
                    style={{
                    backgroundColor: esActivo ? '#133343' : 'transparent',
                    color: esActivo ? '#ffffff' : '#cedce4',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                    }}
                >
                    <i className={`bi ${item.icon} me-2 fs-6`}></i>
                    {item.label}
                </button>
                </li>
            );
            })}
        </ul>

        <hr className="border-secondary border-opacity-50 my-3" />

        <div>
            <button
            type="button"
            onClick={onCerrarSesion}
            className="btn btn-link text-white-50 text-decoration-none d-flex align-items-center px-2 py-1 w-100 border-0"
            >
            <i className="bi bi-box-arrow-left me-2 fs-5"></i>
            Cerrar sesión
            </button>
        </div>
        </div>
    );
}
export default Sidebar;