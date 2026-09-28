import { useState } from 'react';

function Login({ onLoginExitoso }) {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
        const res = await fetch('http://localhost:8080/api/empleados/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, password })
        });

        const data = await res.json();

        if (res.ok) {
            sessionStorage.setItem('usuarioEcoWash', JSON.stringify(data));
            onLoginExitoso(data);
        } else {
            setError(data.mensaje || 'Error al iniciar sesión');
        }
        } catch (err) {
        console.error(err);
        setError('No se pudo conectar con el servidor backend');
        } finally {
        setCargando(false);
        }
    };

    return (
        <div 
        className="d-flex align-items-center justify-content-center min-vh-100"
        style={{ backgroundColor: '#1e485e' }}
        >
        <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5 bg-white" style={{ maxWidth: '400px', width: '90%' }}>
            <div className="text-center mb-4">
            <div className="mb-2">
                <i className="bi bi-droplet-fill text-info" style={{ fontSize: '3rem' }}></i>
            </div>
            <h4 className="fw-bold text-dark mb-1">Sistema de Lavandería</h4>
            <p className="text-secondary small">EcoWash — Panel de Administración</p>
            </div>

            {error && (
            <div className="alert alert-danger py-2 small mb-3">
                {error}
            </div>
            )}

            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Usuario</label>
                <input
                type="text"
                className="form-control"
                placeholder="jperez"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                />
            </div>

            <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Contraseña</label>
                <input
                type="password"
                className="form-control"
                placeholder="....."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <div className="form-text text-danger small mt-2" style={{ fontSize: '0.75rem' }}>
                Ejemplo: usuario <strong>jperez</strong> y contraseña <strong>12345</strong>
                </div>
            </div>

            <button
                type="submit"
                className="btn w-100 py-2 text-white fw-semibold mt-3"
                style={{ backgroundColor: '#1e485e' }}
                disabled={cargando}
            >
                {cargando ? 'Verificando...' : 'Ingresar'}
            </button>
            </form>
        </div>
        </div>
    );
}
export default Login;