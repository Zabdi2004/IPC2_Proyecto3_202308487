import { Link } from 'react-router-dom';
import F1 from '/F1.jpg';
import { FaCog, FaExchangeAlt, FaSearch, FaChartBar, FaTrash } from "react-icons/fa";
import axios from 'axios';
import { sileo } from 'sileo';
import url from '../../Api/url';

const Sidebar = () => {
    const SIDEBAR_LINKS = [
        { id: 1, path: '/',                    name: 'Configuración', icon: FaCog },
        { id: 2, path: '/CargarTransacciones', name: 'Transacciones', icon: FaExchangeAlt },
        { id: 3, path: '/Consultas',           name: 'Consultas',     icon: FaSearch },
        { id: 4, path: '/Graficas',            name: 'Gráficas',      icon: FaChartBar },
    ];

    // Llama al endpoint de reset y notifica al usuario
    const handleReset = async () => {
        const confirmar = window.confirm('¿Estás seguro? Esto borrará todos los datos del sistema.');
        if (!confirmar) return;

        try {
            await axios.post(`${url}Reset/limpiar`);
            sileo.success({
                title: "Datos reseteados",
                description: "El sistema volvió a su estado inicial.",
                fill: "#eeded5",
                styles: { title: "text-[#546b57]", description: "text-[#69ad7c]" },
                duration: 4000,
            });
        } catch (err) {
            console.error(err);
            sileo.error({
                title: "Error",
                description: "No se pudo resetear el sistema.",
                fill: "#eeded5",
                styles: { title: "text-red-500", description: "text-red-400" },
                duration: 4000,
            });
        }
    };

    return (
        <div style={{backgroundColor: '#546b57'}} className='w-16 md:w-56 fixed left-0 top-0 z-10 h-screen pt-8 px-2 flex flex-col justify-between'>
            
            <div>
                {/* Logo */}
                <div className='mb-8 flex justify-center items-center'>
                    <img src={F1} alt="logo" className='w-28 hidden md:flex rounded-md'/>
                    <img src={F1} alt="logo" className='w-8 flex md:hidden rounded-md'/>
                </div>

                {/* Links de navegación */}
                <ul className='mt-6 space-y-2'>
                    {SIDEBAR_LINKS.map((link, index) => (
                        <li
                            key={index}
                            className='font-medium rounded-md py-2 px-5 transition-colors duration-200'
                            style={{color: '#eeded5'}}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#81b68e'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <Link
                                to={link.path}
                                className='flex justify-center md:justify-start items-center md:space-x-5'
                            >
                                <span style={{color: '#eeded5'}} className="text-xl"><link.icon /></span>
                                <span style={{color: '#eeded5'}} className='text-xl hidden md:flex'>{link.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Botón de reset abajo del sidebar */}
            <div className='mb-6 px-3'>
                <button
                    onClick={handleReset}
                    className='w-full flex justify-center md:justify-start items-center md:space-x-3 py-2 px-3 rounded-md transition-colors duration-200 text-white font-medium'
                    style={{backgroundColor: '#8b2020'}}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c0392b'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#8b2020'}
                >
                    <FaTrash className="text-xl" />
                    <span className='hidden md:flex text-sm'>Resetear datos</span>
                </button>

                <p style={{color: '#c8e1cd'}} className="text-xs text-center mt-3 hidden md:block">
                    IPC2 — USAC 2026
                </p>
            </div>

        </div>
    )
}
export default Sidebar;