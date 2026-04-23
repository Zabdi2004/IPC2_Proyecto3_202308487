using Backend.Models;
using Backend.Repositories;
using System.Globalization;
using System.Text;
using System.Xml.Linq;

namespace Backend.Services
{
    public class TransaccionService
    {
        private readonly Repositorio _repositorio;

        // El repositorio se inyecta automáticamente, al ser Singleton
        // todas las operaciones trabajan sobre la misma instancia en memoria
        public TransaccionService(Repositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public string ProcesarTransacciones(string xmlContent)
        {
            XDocument doc = XDocument.Parse(xmlContent);

            int nuevasFacturas = 0, facturasDuplicadas = 0, facturasConError = 0;
            int nuevosPagos = 0, pagosDuplicados = 0, pagosConError = 0;

            // PROCESAR FACTURAS
            var facturasXml = doc.Root?.Element("facturas")?.Elements("factura");
            if (facturasXml != null)
            {
                foreach (var fXml in facturasXml)
                {
                    try
                    {
                        string numero = fXml.Element("numeroFactura")?.Value ?? "";
                        string nit = fXml.Element("NITcliente")?.Value ?? "";
                        string fechaStr = fXml.Element("fecha")?.Value ?? "";
                        decimal valor = decimal.Parse(fXml.Element("valor")?.Value ?? "0");

                        // Validamos que el cliente exista en el sistema
                        // si no existe no tiene sentido registrar la factura
                        bool clienteExiste = _repositorio.Clientes.Any(c => c.NIT == nit);

                        bool fechaValida = DateTime.TryParseExact(
                            fechaStr, "dd/MM/yyyy",
                            CultureInfo.InvariantCulture,
                            DateTimeStyles.None,
                            out DateTime fecha
                        );

                        // Si cualquier validación falla, contamos el error y saltamos al siguiente elemento sin interrumpir todo el proceso
                        if (!clienteExiste || !fechaValida || valor < 0)
                        {
                            facturasConError++;
                            continue;
                        }

                        // El número de factura es suficiente para identificar duplicados
                        bool esDuplicada = _repositorio.Facturas
                            .Any(f => f.NumeroFactura == numero);
                        if (esDuplicada)
                        {
                            facturasDuplicadas++;
                            continue;
                        }

                        // Si pasa todas las validaciones registramos la factura
                        // SaldoPendiente arranca igual al valor total de la factura
                        // y se irá reduciendo conforme lleguen pagos
                        _repositorio.Facturas.Add(new Factura
                        {
                            NumeroFactura = numero,
                            NITCliente = nit,
                            Fecha = fecha,
                            Valor = valor,
                            SaldoPendiente = valor,
                            Pagada = false
                        });
                        nuevasFacturas++;
                    }
                    catch { facturasConError++; }
                }
            }

            //PROCESAR PAGOS Y LÓGICA DE ABONOS
            var pagosXml = doc.Root?.Element("pagos")?.Elements("pago");
            if (pagosXml != null)
            {
                foreach (var pXml in pagosXml)
                {
                    try
                    {
                        string codBanco = pXml.Element("codigoBanco")?.Value ?? "";
                        string nit = pXml.Element("NITcliente")?.Value ?? "";
                        string fechaStr = pXml.Element("fecha")?.Value ?? "";
                        decimal montoPago = decimal.Parse(pXml.Element("valor")?.Value ?? "0");

                        var cliente = _repositorio.Clientes.FirstOrDefault(c => c.NIT == nit);
                        bool bancoExiste = _repositorio.Bancos.Any(b => b.Codigo == codBanco);
                        bool fechaValida = DateTime.TryParseExact(
                            fechaStr, "dd/MM/yyyy",
                            CultureInfo.InvariantCulture,
                            DateTimeStyles.None,
                            out DateTime fechaPago
                        );

                        if (cliente == null || !bancoExiste || !fechaValida || montoPago < 0)
                        {
                            pagosConError++;
                            continue;
                        }

                        // Para pagos verificamos los 3 campos juntos porque
                        // un mismo cliente puede hacer varios pagos al mismo banco
                        // en distintas fechas o por distintos montos
                        bool esDuplicado = _repositorio.Pagos.Any(p =>
                            p.NITCliente == nit &&
                            p.Fecha == fechaPago &&
                            p.Valor == montoPago
                        );
                        if (esDuplicado)
                        {
                            pagosDuplicados++;
                            continue;
                        }

                        // Lógica de abono 
                        // El remanente empieza como la suma del pago actual
                        // más el saldo a favor que ya tenía el cliente
                        // así aprovechamos todo el dinero disponible de una vez
                        decimal remanente = cliente.SaldoAFavor + montoPago;

                        // Limpiamos el saldo a favor porque ya lo sumamos al remanente
                        // si sobra dinero al final se lo devolvemos como saldo a favor
                        cliente.SaldoAFavor = 0;

                        // Ordenamos por fecha para garantizar que siempre se pague
                        // primero la factura más antigua, como indica el enunciado
                        var facturasPendientes = _repositorio.Facturas
                            .Where(f => f.NITCliente == nit && !f.Pagada)
                            .OrderBy(f => f.Fecha)
                            .ToList();

                        foreach (var factura in facturasPendientes)
                        {
                            // Si ya no hay dinero no tiene caso seguir revisando facturas
                            if (remanente <= 0) break;

                            if (remanente >= factura.SaldoPendiente)
                            {
                                // El remanente alcanza para pagar esta factura completa, la marcamos como pagada y continuamos con la siguiente
                                remanente -= factura.SaldoPendiente;
                                factura.SaldoPendiente = 0;
                                factura.Pagada = true;
                            }
                            else
                            {
                                // El remanente no alcanza para pagar la factura completa, abonamos lo que hay y el remanente queda en cero
                                factura.SaldoPendiente -= remanente;
                                remanente = 0;
                            }
                        }

                        // Si después de pagar todas las facturas aún sobra dinero, se guarda como saldo a favor para la próxima compra
                        if (remanente > 0)
                            cliente.SaldoAFavor += remanente;

                        _repositorio.Pagos.Add(new Pago
                        {
                            CodigoBanco = codBanco,
                            NITCliente = nit,
                            Fecha = fechaPago,
                            Valor = montoPago
                        });
                        nuevosPagos++;
                    }
                    catch { pagosConError++; }
                }
            }

            // GENERAR XML DE RESPUESTA 

            XDocument respuestaXML = new XDocument(
                new XDeclaration("1.0", "utf-8", "yes"),
                new XElement("transacciones",
                    new XElement("facturas",
                        new XElement("nuevasFacturas", nuevasFacturas),
                        new XElement("facturasDuplicadas", facturasDuplicadas),
                        new XElement("facturasConError", facturasConError)
                    ),
                    new XElement("pagos",
                        new XElement("nuevosPagos", nuevosPagos),
                        new XElement("pagosDuplicados", pagosDuplicados),
                        new XElement("pagosConError", pagosConError)
                    )
                )
            );

            // Concatenamos manualmente la declaración XML porque es la forma
            // más directa de garantizar que aparezca en el string final
            string declaracion = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
            return declaracion + respuestaXML.ToString();
        }
    }
}