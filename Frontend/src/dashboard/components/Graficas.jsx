import { useState, useEffect } from 'react';
import axios from 'axios';
import { sileo, Toaster } from "sileo";
import { FaCalendarAlt } from 'react-icons/fa';
import url from '../../Api/url';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graficas = () => {
    const fechaActual = new Date();
    const [mes, setMes] = useState(fechaActual.getMonth() + 1);
    const [anio, setAnio] = useState(fechaActual.getFullYear());
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Paleta de colores vintage para las barras de cada banco
    const coloresBancos = [
        '#546b57', '#81b68e', '#5ab4cd',
        '#69ad7c', '#5aa4c5', '#83d5ff',
        '#c8e1cd', '#eeded5', '#81b68e',
    ];

    // Consulta los datos de la gráfica cuando cambia el mes o el año
    useEffect(() => {
        const fetchDatosGrafica = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${url}Consulta/ingresos-bancos?mes=${mes}&anio=${anio}`);
                const data = response.data;

                if (data.length === 0) {
                    setChartData(null);
                    sileo.error({
                        title: "Sin datos",
                        description: "No hay registros para la fecha seleccionada.",
                        fill: "#eeded5",
                        styles: { title: "text-yellow-600", description: "text-yellow-500" }
                    });
                    setLoading(false);
                    return;
                }

                // Obtener períodos únicos ordenados cronológicamente
                const periodosMap = new Map();
                data.forEach(item => {
                    if (!periodosMap.has(item.periodo))
                        periodosMap.set(item.periodo, item.fechaParaOrden);
                });
                const labelsOrdenados = Array.from(periodosMap.keys()).sort((a, b) =>
                    new Date(periodosMap.get(a)) - new Date(periodosMap.get(b))
                );

                // Obtener bancos únicos y crear un dataset por cada uno
                const bancosUnicos = [...new Set(data.map(item => item.banco))];
                const datasets = bancosUnicos.map((banco, index) => ({
                    label: banco,
                    data: labelsOrdenados.map(periodo => {
                        const registro = data.find(item => item.banco === banco && item.periodo === periodo);
                        return registro ? registro.total : 0;
                    }),
                    backgroundColor: coloresBancos[index % coloresBancos.length],
                }));

                setChartData({ labels: labelsOrdenados, datasets });

            } catch (error) {
                console.error("Error al cargar gráfica:", error);
                sileo.error({
                    title: "Error",
                    description: "No se pudieron cargar los datos de la gráfica.",
                    fill: "#eeded5",
                    styles: { title: "text-red-500", description: "text-red-400" }
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDatosGrafica();
    }, [mes, anio]);

    // Configuración visual de la gráfica de barras
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: 'Ingresos por Banco — Últimos 3 meses',
                font: { size: 18 },
                color: '#546b57'
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Total (Q)', color: '#546b57' },
                ticks: { color: '#546b57' },
                grid: { color: '#c8e1cd' }
            },
            x: {
                ticks: { color: '#546b57' },
                grid: { color: '#c8e1cd' }
            }
        }
    };

    return (
        <>
            <Toaster position="bottom-right" />
            <div className="p-8 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 pb-2 border-b" style={{color: '#546b57', borderColor: '#81b68e'}}>
                    Gráficas de Ingresos
                </h2>

                {/* Filtros de mes y año */}
                <div className="bg-white p-6 rounded-lg shadow-md border mb-8" style={{borderColor: '#81b68e'}}>
                    <p className="mb-4" style={{color: '#546b57'}}>
                        Selecciona el mes y año de referencia. Se mostrarán los últimos 3 meses.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex items-center gap-2 p-2 rounded-md border" style={{backgroundColor: '#f0f7f2', borderColor: '#c8e1cd'}}>
                            <FaCalendarAlt style={{color: '#546b57'}} />
                            <select
                                value={mes}
                                onChange={(e) => setMes(parseInt(e.target.value))}
                                className="bg-transparent outline-none" style={{color: '#546b57'}}
                            >
                                <option value={1}>Enero</option>
                                <option value={2}>Febrero</option>
                                <option value={3}>Marzo</option>
                                <option value={4}>Abril</option>
                                <option value={5}>Mayo</option>
                                <option value={6}>Junio</option>
                                <option value={7}>Julio</option>
                                <option value={8}>Agosto</option>
                                <option value={9}>Septiembre</option>
                                <option value={10}>Octubre</option>
                                <option value={11}>Noviembre</option>
                                <option value={12}>Diciembre</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 p-2 rounded-md border" style={{backgroundColor: '#f0f7f2', borderColor: '#c8e1cd'}}>
                            <select
                                value={anio}
                                onChange={(e) => setAnio(parseInt(e.target.value))}
                                className="bg-transparent outline-none" style={{color: '#546b57'}}
                            >
                                <option value={2023}>2023</option>
                                <option value={2024}>2024</option>
                                <option value={2025}>2025</option>
                                <option value={2026}>2026</option>
                                <option value={2027}>2027</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Contenedor de la gráfica */}
                <div className="bg-white p-6 rounded-lg shadow-md border min-h-[400px] flex items-center justify-center" style={{borderColor: '#81b68e'}}>
                    {loading ? (
                        <p className="text-xl font-bold animate-pulse" style={{color: '#81b68e'}}>Cargando gráfica...</p>
                    ) : chartData ? (
                        <Bar data={chartData} options={chartOptions} />
                    ) : (
                        <p style={{color: '#81b68e'}}>No hay datos disponibles para graficar en este período.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Graficas;