import { useState, useEffect } from 'react';

function Empleados() {
    const [empleados, setEmpleados] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [formData, setFormData] = useState({
        nombre: '',
        usuario: '',
        password: '',
        rol: 'Operador',
        estado: 'Activo'
    });

    const cargarEmpleados = async () => {
        try {
        const res = await fetch('http://localhost:8080/api/empleados');
        const data = await res.json();
        setEmpleados(data);
        setCargando(false);
        } catch (error) {
        console.error(error);
        setCargando(false);
        }
    };

    useEffect(() => {
        cargarEmpleados();
    }, []);

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await fetch('http://localhost:8080/api/empleados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            setFormData({
            nombre: '',
            usuario: '',
            password: '',
            rol: 'Operador',
            estado: 'Activo'
            });
            setMostrarForm(false);
            cargarEmpleados();
        } else {
            const errorData = await res.json();
            alert(errorData.mensaje || 'Error al guardar');
        }
        } catch (error) {
        console.error(error);
        }
    };

    const alternarEstado = async (id, estadoActual) => {
        const nuevoEstado = estadoActual === 'Activo' ? 'Inactivo' : 'Activo';
        try {
        const res = await fetch(`http://localhost:8080/api/empleados/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });

        if (res.ok) {
            setEmpleados(empleados.map(emp => emp.id === id ? { ...emp, estado: nuevoEstado } : emp));
        }
        } catch (error) {
        console.error(error);
        }
    };

    const eliminarEmpleado = async (id) => {
        if (!window.confirm('¿Deseas eliminar este registro de empleado?')) return;
        try {
        const res = await fetch(`http://localhost:8080/api/empleados/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            setEmpleados(empleados.filter(emp => emp.id !== id));
        }
        } catch (error) {
        console.error(error);
        }
    };

    return (
        <div className="card shadow-sm border border-secondary border-opacity-25 rounded-3 bg-white">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
            <h5 className="mb-0 fw-bold text-dark">Listado de empleados</h5>
            <button
            className="btn btn-sm text-white px-3 fw-semibold"
            style={{ backgroundColor: '#1e485e' }}
            onClick={() => setMostrarForm(!mostrarForm)}
            >
            {mostrarForm ? 'Cancelar' : '+ Agregar empleado'}
            </button>
        </div>

        <div className="card-body p-4">
            {mostrarForm && (
            <form onSubmit={handleSubmit} className="p-3 mb-4 bg-light rounded-3 border">
                <h6 className="fw-bold mb-3">Registrar Nuevo Empleado</h6>
                <div className="row g-3 mb-3">
                <div className="col-md-3">
                    <label className="form-label small fw-bold text-secondary">Nombre Completo</label>
                    <input
                    type="text"
                    name="nombre"
                    className="form-control form-control-sm"
                    placeholder="Ej. Carlos Mendez"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label small fw-bold text-secondary">Usuario</label>
                    <input
                    type="text"
                    name="usuario"
                    className="form-control form-control-sm"
                    placeholder="Ej. cmendez"
                    value={formData.usuario}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className="col-md-2">
                    <label className="form-label small fw-bold text-secondary">Contraseña</label>
                    <input
                    type="password"
                    name="password"
                    className="form-control form-control-sm"
                    placeholder="....."
                    value={formData.password}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className="col-md-2">
                    <label className="form-label small fw-bold text-secondary">Rol</label>
                    <select
                    name="rol"
                    className="form-select form-select-sm"
                    value={formData.rol}
                    onChange={handleChange}
                    >
                    <option value="Administrador">Administrador</option>
                    <option value="Operador">Operador</option>
                    </select>
                </div>

                <div className="col-md-2">
                    <label className="form-label small fw-bold text-secondary">Estado</label>
                    <select
                    name="estado"
                    className="form-select form-select-sm"
                    value={formData.estado}
                    onChange={handleChange}
                    >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    </select>
                </div>
                </div>

                <button type="submit" className="btn btn-dark btn-sm px-4">
                Guardar Empleado
                </button>
            </form>
            )}

            {cargando ? (
            <div className="alert alert-info py-2 small">Cargando nómina de empleados...</div>
            ) : (
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                    <tr className="small text-secondary">
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {empleados.map((emp) => (
                    <tr key={emp.id}>
                        <td className="fw-semibold text-dark">{emp.nombre}</td>
                        <td className="font-monospace text-secondary small">{emp.usuario}</td>
                        <td>
                        <span className="badge bg-secondary bg-opacity-10 text-dark border px-2 py-1">
                            {emp.rol}
                        </span>
                        </td>
                        <td>
                        <button
                            onClick={() => alternarEstado(emp.id, emp.estado)}
                            className={`badge rounded-pill border-0 px-3 py-1 fw-semibold cursor-pointer ${
                            emp.estado === 'Activo'
                                ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-25'
                                : 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25'
                            }`}
                            title="Haz clic para cambiar estado"
                        >
                            {emp.estado}
                        </button>
                        </td>
                        <td className="text-center">
                        <button
                            onClick={() => eliminarEmpleado(emp.id)}
                            className="btn btn-outline-danger btn-sm px-2 py-1"
                            title="Eliminar empleado"
                        >
                            Eliminar
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </div>
        </div>
    );
}
export default Empleados;