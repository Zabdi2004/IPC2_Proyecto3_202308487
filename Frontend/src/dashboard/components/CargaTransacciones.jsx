import { useState } from 'react';
import axios from 'axios';
import { FaUpload, FaDownload, FaFileCode } from 'react-icons/fa';
import { sileo, Toaster } from "sileo";
import url from '../../Api/url';

const CargaTransacciones = () => {
    const [file, setFile] = useState(null);
    const [responseXml, setResponseXml] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Actualiza el archivo y limpia estado previo
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResponseXml('');
        setError(null);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Por favor, selecciona un archivo XML de transacciones.');
            return;
        }

        setLoading(true);
        setError(null);

        // FormData necesario porque el Backend recibe IFormFile
        const formData = new FormData();
        formData.append('archivo', file);

        try {
            const response = await axios.post(`${url}Transaccion/Cargar`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setResponseXml(response.data);

            sileo.success({
                title: "Transacciones Procesadas",
                description: "Facturas y pagos procesados exitosamente.",
                fill: "#eeded5",
                styles: {
                    title: "text-[#546b57]",
                    description: "text-[#69ad7c]",
                },
                duration: 5000,
            });
        } catch (err) {
            console.error(err);
            setError('Error al procesar las transacciones. Verifica que el Backend esté corriendo.');

            sileo.error({
                title: "Error",
                description: "No se pudo cargar el archivo de transacciones.",
                fill: "#eeded5",
                styles: {
                    title: "text-red-500",
                    description: "text-red-400",
                },
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Genera y descarga el XML de respuesta como archivo
    const handleDownload = () => {
        if (!responseXml) return;

        const blob = new Blob([responseXml], { type: 'application/xml' });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'respuestaTransacciones.xml');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
    };

    return (
        <>
            <Toaster position="bottom-right" />
            <div className="p-8 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6" style={{color: '#546b57'}}>
                    Carga de Transacciones
                </h2>

                <div className="bg-white p-6 rounded-lg shadow-md border" style={{borderColor: '#81b68e'}}>
                    <p className="mb-6" style={{color: '#546b57'}}>
                        Selecciona tu archivo transac.xml para procesar facturas y pagos del sistema.
                    </p>

                    {/* Formulario de carga del archivo */}
                    <form onSubmit={handleUpload} className="flex flex-col gap-4 mb-8">
                        <label 
                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors"
                            style={{borderColor: '#81b68e', backgroundColor: '#f0f7f2'}}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c8e1cd'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f0f7f2'}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FaUpload className="text-4xl mb-3" style={{color: '#546b57'}} />
                                <p className="text-lg font-semibold" style={{color: '#546b57'}}>
                                    Haz clic para seleccionar tu archivo
                                </p>
                                <p className="text-sm mt-1" style={{color: '#81b68e'}}>
                                    Solo archivos .xml
                                </p>
                                {file && (
                                    <p className="text-sm mt-2 font-bold" style={{color: '#546b57'}}>
                                        ✅ {file.name}
                                    </p>
                                )}
                            </div>
                            <input
                                type="file"
                                accept=".xml"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={loading || !file}
                            className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 rounded-md text-white font-medium transition-colors w-full"
                            style={!(loading || !file) ? {backgroundColor: '#546b57'} : {backgroundColor: '#9ca3af', cursor: 'not-allowed'}}
                            onMouseEnter={e => { if (!(loading || !file)) e.currentTarget.style.backgroundColor = '#69ad7c' }}
                            onMouseLeave={e => { if (!(loading || !file)) e.currentTarget.style.backgroundColor = '#546b57' }}
                        >
                            <FaUpload />
                            {loading ? 'Procesando...' : 'Cargar archivo'}
                        </button>
                    </form>

                    {/* Mensaje de error si falla la petición */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {/* Área de respuesta, visible solo cuando hay resultado */}
                    {responseXml && (
                        <div className="mt-8 pt-6 border-t" style={{borderColor: '#81b68e'}}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold flex items-center gap-2" style={{color: '#546b57'}}>
                                    <FaFileCode style={{color: '#81b68e'}} />
                                    Resumen de Transacciones
                                </h3>

                                <button
                                    onClick={handleDownload}
                                    className="cursor-pointer flex items-center gap-2 text-white px-4 py-2 rounded-md transition-colors"
                                    style={{backgroundColor: '#81b68e'}}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#546b57'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#81b68e'}
                                >
                                    <FaDownload />
                                    Descargar XML
                                </button>
                            </div>

                            {/* XML de respuesta en modo solo lectura */}
                            <textarea
                                readOnly
                                value={responseXml}
                                className="w-full h-64 p-4 font-mono text-sm bg-gray-50 border rounded-md focus:outline-none focus:ring-2"
                                style={{color: '#546b57', borderColor: '#c8e1cd'}}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default CargaTransacciones;