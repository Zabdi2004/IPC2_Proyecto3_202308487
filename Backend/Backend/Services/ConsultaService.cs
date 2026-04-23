using Backend.Repositories;
using System.Globalization;

namespace Backend.Services
{
    public class ConsultaService
    {
        private readonly Repositorio _repositorio;

        public ConsultaService(Repositorio repositorio)
        {
            _repositorio = repositorio;
        }

        // Devuelve todos los clientes ordenados alfabéticamente por NIT
        public object ObtenerTodosLosClientes()
        {
            return _repositorio.Clientes
                .OrderBy(c => c.NIT)
                .Select(c => new {
                    c.NIT,
                    c.Nombre,
                    SaldoFavor = c.SaldoAFavor
                })
                .ToList();
        }

        // Devuelve el historial completo de movimientos de un cliente específico
        public object? ObtenerEstadoCuenta(string nit)
        {
            var cliente = _repositorio.Clientes.FirstOrDefault(c => c.NIT == nit);

            // Si el NIT no existe en el sistema no hay nada que mostrar
            if (cliente == null) return null;

            // Convertimos las facturas a un formato neutro de "transacción"
            // el cargo muestra el valor y el número de factura como referencia
            var cargos = _repositorio.Facturas
                .Where(f => f.NITCliente == nit)
                .Select(f => new {
                    f.Fecha,
                    Cargo = $"Q. {f.Valor:N2} (Fact. # {f.NumeroFactura})",
                    Abono = "",
                    FechaSort = f.Fecha
                });

            // Convertimos los pagos al mismo formato neutro
            // el abono muestra el valor y el nombre del banco que procesó el pago
            var abonos = _repositorio.Pagos
                .Where(p => p.NITCliente == nit)
                .Select(p => new {
                    p.Fecha,
                    Cargo = "",
                    Abono = $"Q. {p.Valor:N2} ({NombreBanco(p.CodigoBanco)})",
                    FechaSort = p.Fecha
                });

            // Concat une las dos listas en una sola sin duplicar
            // OrderByDescending pone lo más reciente arriba, como un estado de cuenta real
            var historial = cargos.Concat(abonos)
                .OrderByDescending(t => t.FechaSort)
                .Select(t => new {
                    Fecha = t.Fecha.ToString("dd/MM/yyyy"),
                    t.Cargo,
                    t.Abono
                })
                .ToList();

            return new
            {
                Cliente = $"{cliente.NIT} - {cliente.Nombre}",
                SaldoActual = $"Q. {cliente.SaldoAFavor:N2}",
                Transacciones = historial
            };
        }

        // Agrupa los pagos por banco y por mes para generar la gráfica de ingresos
        // siempre muestra exactamente 3 meses: el seleccionado y los 2 anteriores
        public object ObtenerIngresosPorBanco(int mes, int anio)
        {
            // El rango va desde el inicio del mes de hace 2 meses
            // hasta el último día del mes seleccionado
            DateTime fechaInicio = new DateTime(anio, mes, 1).AddMonths(-2);
            DateTime fechaFin = new DateTime(anio, mes, 1).AddMonths(1).AddDays(-1);

            var ingresosAgrupados = _repositorio.Pagos
                .Where(p => p.Fecha >= fechaInicio && p.Fecha <= fechaFin)
                // Agrupamos por banco Y por mes para tener una barra por cada combinación
                .GroupBy(p => new {
                    p.CodigoBanco,
                    Mes = p.Fecha.Month,
                    Anio = p.Fecha.Year
                })
                .Select(grupo => {
                    // Buscamos el nombre del banco, si no existe usamos el código como fallback
                    var banco = _repositorio.Bancos.FirstOrDefault(b => b.Codigo == grupo.Key.CodigoBanco);
                    string nombre = banco?.Nombre ?? $"Banco {grupo.Key.CodigoBanco}";

                    string periodo = new DateTime(grupo.Key.Anio, grupo.Key.Mes, 1)
                        .ToString("MMMM yyyy", new CultureInfo("es-GT"));

                    return new
                    {
                        Banco = nombre,
                        Periodo = periodo,
                        Total = grupo.Sum(p => p.Valor),
                        // FechaParaOrden no se muestra al cliente, solo sirve para ordenar
                        FechaParaOrden = new DateTime(grupo.Key.Anio, grupo.Key.Mes, 1)
                    };
                })
                .OrderBy(r => r.FechaParaOrden)
                .ToList();

            return ingresosAgrupados;
        }

        // Método auxiliar para obtener el nombre de un banco por su código
        // se usa en el historial de pagos para mostrar el nombre en vez del código
        private string NombreBanco(string codigo)
        {
            var banco = _repositorio.Bancos.FirstOrDefault(b => b.Codigo == codigo);
            return banco?.Nombre ?? codigo;
        }
    }
}