import { FaUser, FaBook, FaGithub, FaCode, FaDatabase, FaFileCode } from 'react-icons/fa';

const Ayuda = () => {
    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 pb-2 border-b" style={{color: '#546b57', borderColor: '#81b68e'}}>
                Ayuda
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Tarjeta del estudiante */}
                <div className="bg-white p-6 rounded-lg shadow-md border" style={{borderColor: '#81b68e'}}>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-6" style={{color: '#546b57'}}>
                        <FaUser style={{color: '#81b68e'}} />
                        Información del Estudiante
                    </h3>

                    {/* Avatar emoji */}
                    <div className="flex justify-center mb-6">
                        <div className="w-32 h-32 rounded-full flex items-center justify-center text-6xl border-4"
                            style={{backgroundColor: '#c8e1cd', borderColor: '#81b68e'}}>
                            🧑‍💻
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="p-3 rounded-md" style={{backgroundColor: '#f0f7f2'}}>
                            <p className="text-xs uppercase font-semibold mb-1" style={{color: '#81b68e'}}>Nombre</p>
                            <p className="font-bold" style={{color: '#546b57'}}>Zabdi Merari Adina Donis Rosales</p>
                        </div>
                        <div className="p-3 rounded-md" style={{backgroundColor: '#f0f7f2'}}>
                            <p className="text-xs uppercase font-semibold mb-1" style={{color: '#81b68e'}}>Carnet</p>
                            <p className="font-bold" style={{color: '#546b57'}}>202308487</p>
                        </div>
                        <div className="p-3 rounded-md" style={{backgroundColor: '#f0f7f2'}}>
                            <p className="text-xs uppercase font-semibold mb-1" style={{color: '#81b68e'}}>Curso</p>
                            <p className="font-bold" style={{color: '#546b57'}}>Introducción a la Programación y Computación 2</p>
                        </div>
                        <div className="p-3 rounded-md" style={{backgroundColor: '#f0f7f2'}}>
                            <p className="text-xs uppercase font-semibold mb-1" style={{color: '#81b68e'}}>Universidad</p>
                            <p className="font-bold" style={{color: '#546b57'}}>Universidad de San Carlos de Guatemala</p>
                        </div>
                    </div>
                </div>

                {/* Tarjeta de documentación */}
                <div className="bg-white p-6 rounded-lg shadow-md border" style={{borderColor: '#81b68e'}}>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-6" style={{color: '#546b57'}}>
                        <FaBook style={{color: '#81b68e'}} />
                        Documentación del Sistema
                    </h3>

                    <div className="space-y-4">

                        <div className="p-4 rounded-md border" style={{backgroundColor: '#f0f7f2', borderColor: '#c8e1cd'}}>
                            <div className="flex items-center gap-2 mb-2">
                                <FaCode style={{color: '#546b57'}} />
                                <p className="font-bold" style={{color: '#546b57'}}>Tecnologías utilizadas</p>
                            </div>
                            <ul className="text-sm space-y-1" style={{color: '#69ad7c'}}>
                                <li>• Backend: C# — ASP.NET Core Web API</li>
                                <li>• Frontend: React + Vite + Tailwind CSS</li>
                                <li>• Gráficas: Chart.js</li>
                                <li>• Notificaciones: Sileo</li>
                            </ul>
                        </div>

                        <div className="p-4 rounded-md border" style={{backgroundColor: '#f0f7f2', borderColor: '#c8e1cd'}}>
                            <div className="flex items-center gap-2 mb-2">
                                <FaDatabase style={{color: '#546b57'}} />
                                <p className="font-bold" style={{color: '#546b57'}}>Funcionalidades</p>
                            </div>
                            <ul className="text-sm space-y-1" style={{color: '#69ad7c'}}>
                                <li>• Carga de clientes y bancos via config.xml</li>
                                <li>• Procesamiento de facturas y pagos via transac.xml</li>
                                <li>• Consulta de estado de cuenta por cliente</li>
                                <li>• Grafica de ingresos por banco</li>
                                <li>• Persistencia de datos en archivos XML</li>
                            </ul>
                        </div>

                        <div className="p-4 rounded-md border" style={{backgroundColor: '#f0f7f2', borderColor: '#c8e1cd'}}>
                            <div className="flex items-center gap-2 mb-2">
                                <FaFileCode style={{color: '#546b57'}} />
                                <p className="font-bold" style={{color: '#546b57'}}>Estructura del sistema</p>
                            </div>
                            <ul className="text-sm space-y-1" style={{color: '#69ad7c'}}>
                                <li>• Models: Cliente, Banco, Factura, Pago</li>
                                <li>• Services: ConfigService, TransaccionService, ConsultaService</li>
                                <li>• Controllers: Config, Transaccion, Consulta, Reset</li>
                                <li>• Repositorio con persistencia XML</li>
                            </ul>
                        </div>

                        <div className="p-4 rounded-md border" style={{backgroundColor: '#f0f7f2', borderColor: '#c8e1cd'}}>
                            <div className="flex items-center gap-2 mb-2">
                                <FaGithub style={{color: '#546b57'}} />
                                <p className="font-bold" style={{color: '#546b57'}}>Repositorio GitHub</p>
                            </div>
                            <p className="text-sm" style={{color: '#5ab4cd'}}>
                                IPC2_Proyecto3_202308487
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ayuda;