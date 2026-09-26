function Encabezado({ titulo, subtitulo }) {
    return (
        <header className="text-center my-4 py-4 bg-white border border-secondary border-opacity-25 rounded-3 shadow-sm">
        <h1 className="fw-bold text-dark mb-1">{titulo}</h1>
        <p className="text-secondary mb-0 fs-6">{subtitulo}</p>
        </header>
    );
}
export default Encabezado;