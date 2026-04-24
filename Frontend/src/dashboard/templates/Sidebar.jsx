import { Link } from 'react-router-dom';
import F1 from '/F1.jpg';
import { FaCog, FaExchangeAlt, FaSearch, FaChartBar } from "react-icons/fa";

const Sidebar = () => {
    const SIDEBAR_LINKS = [
        { id: 1, path: '/',                    name: 'Configuración', icon: FaCog },
        { id: 2, path: '/CargarTransacciones', name: 'Transacciones', icon: FaExchangeAlt },
        { id: 3, path: '/Consultas',           name: 'Consultas',     icon: FaSearch },
        { id: 4, path: '/Graficas',            name: 'Gráficas',      icon: FaChartBar },
    ];

    return (
        <div style={{backgroundColor: '#546b57'}} className='w-16 md:w-56 fixed left-0 top-0 z-10 h-screen pt-8 px-2'>
            
            <div className='mb-8 flex justify-center items-center'>
                <img src={F1} alt="logo" className='w-28 hidden md:flex rounded-md'/>
                <img src={F1} alt="logo" className='w-8 flex md:hidden rounded-md'/>
            </div>

            <ul className='mt-6 space-y-2'>
                {SIDEBAR_LINKS.map((link, index) => (
                    <li key={index} className='font-medium rounded-md py-2 px-5 transition-colors duration-200'
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

            <div className="absolute bottom-4 left-0 w-full px-5 hidden md:block">
                <p style={{color: '#c8e1cd'}} className="text-xs text-center">IPC2 — USAC 2026</p>
            </div>

        </div>
    )
}
export default Sidebar;