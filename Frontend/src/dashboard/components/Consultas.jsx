import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaUserTie, FaMoneyBillWave, FaListAlt, FaUsers } from 'react-icons/fa';
import { sileo, Toaster } from "sileo";
import url from '../../Api/url';
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';

const Consultas = () => {
    const [clientes, setClientes] = useState([]);
    const [selectedNit, setSelectedNit] = useState('');
    const [loadingClientes, setLoadingClientes] = useState(true);
    const [clienteData, setClienteData] = useState(null);
    const [loadingDetalle, setLoadingDetalle] = useState(false);

    // Ref para capturar el área del estado de cuenta
    const pdfRef = useRef(null);

    // Genera y descarga el PDF del estado de cuenta visible
    const handleDescargarPDF = () => {
        const elemento = pdfRef.current;
        if (!elemento) return;

        // Creamos una ventana nueva solo con el contenido del estado de cuenta
        const ventana = window.open('', '_blank');
        ventana.document.write(`
            <html>
                <head>
                    <title>Estado de Cuenta - ${selectedNit}</title>
                    <style>
                        body { font-family: 'Times New Roman', serif; padding: 20px; color: #546b57; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th { background-color: #f0f7f2; padding: 10px; text-align: left; border: 1px solid #c8e1cd; }
                        td { padding: 10px; border: 1px solid #c8e1cd; }
                        .cargo { color: #dc2626; }
                        .abono { color: #16a34a; }
                        h2 { color: #546b57; border-bottom: 2px solid #81b68e; padding-bottom: 10px; }
                        .saldo { background-color: #f0f7f2; padding: 10px; border-radius: 5px; display: inline-block; margin-top: 10px; }
                    </style>
                </head>
                <body>
                    ${elemento.innerHTML}
                </body>
            </html>
        `);
        ventana.document.close();
        ventana.print();
    };

    // Carga la lista de clientes al montar el componente
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get(`${url}Consulta/clientes`);
                setClientes(response.data);
                setLoadingClientes(false);
            } catch (err) {
                console.error("Error al cargar clientes:", err);
                setLoadingClientes(false);
                sileo.error({
                    title: "Error de conexión",
                    description: "No se pudo cargar la lista de clientes.",
                    fill: "#eeded5",
                    styles: { title: "text-red-500", description: "text-red-400" },
                    duration: 5000,
                });
            }
        };
        fetchClientes();
    }, []);

    // Busca el detalle de un cliente por su NIT
    const fetchDetalleCliente = async (nitToSearch) => {
        if (!nitToSearch) return;
        setLoadingDetalle(true);
        setClienteData(null);

        try {
            const response = await axios.get(`${url}Consulta/cliente/${nitToSearch}`);
            setClienteData(response.data);
            sileo.success({
                title: "Consulta Exitosa",
                description: "Datos cargados correctamente.",
                fill: "#eeded5",
                styles: { title: "text-[#546b57]", description: "text-[#69ad7c]" },
                duration: 4000,
            });
        } catch (err) {
            console.error("Error al buscar cliente:", err);
            sileo.error({
                title: "Error en la consulta",
                description: "Hubo un problema al buscar las transacciones.",
                fill: "#eeded5",
                styles: { title: "text-red-500", description: "text-red-400" },
                duration: 5000,
            });
        } finally {
            setLoadingDetalle(false);
        }
    };

    // Maneja el envío del formulario de búsqueda
    const handleBuscarSubmit = (e) => {
        e.preventDefault();
        if (!selectedNit) {
            sileo.error({
                title: "Atención",
                description: "Por favor selecciona un cliente.",
                fill: "#eeded5",
                styles: { title: "text-yellow-600", description: "text-yellow-500" },
                duration: 4000,
            });
            return;
        }
        fetchDetalleCliente(selectedNit);
    };

    // Selecciona un cliente desde la lista lateral y busca su detalle
    const handleSeleccionDesdeLista = (nit) => {
        setSelectedNit(nit);
        fetchDetalleCliente(nit);
    };

    return (
        <>
            <Toaster position="bottom-right" />
            <div className="p-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 pb-2 border-b" style={{color: '#546b57', borderColor: '#81b68e'}}>
                    Panel de Consultas
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Lista lateral de clientes */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-lg shadow-md border h-fit" style={{borderColor: '#81b68e'}}>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-4" style={{color: '#546b57'}}>
                            <FaUsers style={{color: '#81b68e'}} />
                            Directorio de Clientes
                        </h3>

                        <div className="max-h-[600px] overflow-y-auto pr-2 space-y-2">
                            {loadingClientes ? (
                                <p className="text-center py-4" style={{color: '#81b68e'}}>Cargando...</p>
                            ) : clientes.length === 0 ? (
                                <p className="text-center py-4" style={{color: '#81b68e'}}>No hay clientes registrados.</p>
                            ) : (
                                clientes.map((cliente) => (
                                    <button
                                        key={cliente.nit}
                                        onClick={() => handleSeleccionDesdeLista(cliente.nit)}
                                        className="cursor-pointer w-full text-left p-3 rounded-md border transition-all duration-200"
                                        style={selectedNit === cliente.nit
                                            ? {backgroundColor: '#546b57', borderColor: '#546b57', color: 'white'}
                                            : {backgroundColor: '#f9f9f7', borderColor: '#c8e1cd', color: '#546b57'}
                                        }
                                    >
                                        <p className="font-bold">{cliente.nit}</p>
                                        <p className="text-sm truncate">{cliente.nombre}</p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Columna derecha: buscador y resultados */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Buscador con select */}
                        <div className="bg-white p-6 rounded-lg shadow-md border" style={{borderColor: '#81b68e'}}>
                            <p className="mb-6" style={{color: '#546b57'}}>
                                Selecciona un cliente del listado o búscalo en el desplegable.
                            </p>

                            <form onSubmit={handleBuscarSubmit} className="flex flex-col md:flex-row items-center gap-4">
                                <div className="w-full relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUserTie style={{color: '#81b68e'}} />
                                    </div>
                                    <select
                                        value={selectedNit}
                                        onChange={(e) => setSelectedNit(e.target.value)}
                                        disabled={loadingClientes}
                                        className="block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 appearance-none bg-gray-50"
                                        style={{borderColor: '#c8e1cd', color: '#546b57'}}
                                    >
                                        <option value="">
                                            {loadingClientes ? "Cargando clientes..." : "-- Seleccione un Cliente --"}
                                        </option>
                                        {clientes.map((cliente) => (
                                            <option key={cliente.nit} value={cliente.nit}>
                                                {cliente.nit} - {cliente.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loadingDetalle || loadingClientes || !selectedNit}
                                    className="cursor-pointer flex items-center justify-center gap-2 px-8 py-2 rounded-md text-white font-medium transition-colors w-full md:w-auto"
                                    style={!(loadingDetalle || !selectedNit)
                                        ? {backgroundColor: '#546b57'}
                                        : {backgroundColor: '#9ca3af', cursor: 'not-allowed'}
                                    }
                                    onMouseEnter={e => { if (!loadingDetalle && selectedNit) e.currentTarget.style.backgroundColor = '#69ad7c' }}
                                    onMouseLeave={e => { if (!loadingDetalle && selectedNit) e.currentTarget.style.backgroundColor = '#546b57' }}
                                >
                                    <FaSearch />
                                    {loadingDetalle ? 'Buscando...' : 'Consultar'}
                                </button>
                            </form>
                        </div>

                        {/* Resultados del estado de cuenta */}
                        {clienteData && (
                            <div>
                                {/* Botón de descarga PDF */}
                                <div className="flex justify-end mb-3">
                                    <button
                                        onClick={handleDescargarPDF}
                                        className="flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition-colors"
                                        style={{backgroundColor: '#546b57'}}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#69ad7c'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#546b57'}
                                    >
                                        📄 Descargar PDF
                                    </button>
                                </div>

                                {/* Área que se exportará al PDF */}
                                <div ref={pdfRef} className="bg-white p-6 rounded-lg shadow-md border" style={{borderColor: '#81b68e'}}>

                                    {/* Cabecera con nombre y saldo */}
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b gap-4" style={{borderColor: '#c8e1cd'}}>
                                        <div>
                                            <h3 className="text-2xl font-bold flex items-center gap-2" style={{color: '#546b57'}}>
                                                <FaUserTie style={{color: '#81b68e'}} />
                                                {clienteData.cliente}
                                            </h3>
                                        </div>
                                        <div className="px-4 py-2 rounded-md border flex items-center gap-3" style={{backgroundColor: '#f0f7f2', borderColor: '#c8e1cd'}}>
                                            <FaMoneyBillWave className="text-green-600 text-xl" />
                                            <div>
                                                <p className="text-xs uppercase font-semibold" style={{color: '#81b68e'}}>Saldo Actual</p>
                                                <p className="text-xl font-bold" style={{color: '#546b57'}}>{clienteData.saldoActual}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tabla de transacciones */}
                                    <div>
                                        <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{color: '#546b57'}}>
                                            <FaListAlt style={{color: '#81b68e'}} />
                                            Historial de Transacciones
                                        </h4>

                                        <div className="overflow-x-auto border rounded-md" style={{borderColor: '#c8e1cd'}}>
                                            <table className="min-w-full divide-y" style={{borderColor: '#c8e1cd'}}>
                                                <thead style={{backgroundColor: '#f0f7f2'}}>
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#546b57'}}>Fecha</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#546b57'}}>Cargo</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: '#546b57'}}>Abono</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y" style={{borderColor: '#c8e1cd'}}>
                                                    {clienteData.transacciones && clienteData.transacciones.length > 0 ? (
                                                        clienteData.transacciones.map((tx, index) => (
                                                            <tr key={index} className="transition-colors"
                                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fdf9'}
                                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#546b57'}}>{tx.fecha}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">{tx.cargo || "-"}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{tx.abono || "-"}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="3" className="px-6 py-8 text-center" style={{color: '#81b68e'}}>
                                                                No hay transacciones registradas para este cliente.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Consultas;