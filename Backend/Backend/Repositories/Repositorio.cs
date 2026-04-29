using Backend.Models;
using System.Xml.Linq;

namespace Backend.Repositories
{
    public class Repositorio
    {
        // Rutas donde se guardarán los archivos XML de persistencia
        private readonly string _rutaClientes = "Data/clientes.xml";
        private readonly string _rutaBancos = "Data/bancos.xml";
        private readonly string _rutaFacturas = "Data/facturas.xml";
        private readonly string _rutaPagos = "Data/pagos.xml";

        public List<Cliente> Clientes { get; set; }
        public List<Banco> Bancos { get; set; }
        public List<Factura> Facturas { get; set; }
        public List<Pago> Pagos { get; set; }

        public Repositorio()
        {
            // Creamos la carpeta Data si no existe al arrancar el servidor
            Directory.CreateDirectory("Data");

            // Cargamos los datos desde XML al iniciar
            // si los archivos no existen inicializamos listas vacías
            Clientes = CargarClientes();
            Bancos = CargarBancos();
            Facturas = CargarFacturas();
            Pagos = CargarPagos();
        }

        private List<Cliente> CargarClientes()
        {
            if (!File.Exists(_rutaClientes)) return new List<Cliente>();
            try
            {
                var doc = XDocument.Load(_rutaClientes);
                return doc.Root!.Elements("cliente").Select(e => new Cliente
                {
                    NIT = (string)e.Element("NIT")!,
                    Nombre = (string)e.Element("nombre")!,
                    SaldoAFavor = (decimal)e.Element("saldoAFavor")!
                }).ToList();
            }
            catch { return new List<Cliente>(); }
        }

        private List<Banco> CargarBancos()
        {
            if (!File.Exists(_rutaBancos)) return new List<Banco>();
            try
            {
                var doc = XDocument.Load(_rutaBancos);
                return doc.Root!.Elements("banco").Select(e => new Banco
                {
                    Codigo = (string)e.Element("codigo")!,
                    Nombre = (string)e.Element("nombre")!
                }).ToList();
            }
            catch { return new List<Banco>(); }
        }

        private List<Factura> CargarFacturas()
        {
            if (!File.Exists(_rutaFacturas)) return new List<Factura>();
            try
            {
                var doc = XDocument.Load(_rutaFacturas);
                return doc.Root!.Elements("factura").Select(e => new Factura
                {
                    NumeroFactura = (string)e.Element("numeroFactura")!,
                    NITCliente = (string)e.Element("NITCliente")!,
                    Fecha = DateTime.Parse((string)e.Element("fecha")!),
                    Valor = (decimal)e.Element("valor")!,
                    SaldoPendiente = (decimal)e.Element("saldoPendiente")!,
                    Pagada = (bool)e.Element("pagada")!
                }).ToList();
            }
            catch { return new List<Factura>(); }
        }

        private List<Pago> CargarPagos()
        {
            if (!File.Exists(_rutaPagos)) return new List<Pago>();
            try
            {
                var doc = XDocument.Load(_rutaPagos);
                return doc.Root!.Elements("pago").Select(e => new Pago
                {
                    CodigoBanco = (string)e.Element("codigoBanco")!,
                    NITCliente = (string)e.Element("NITCliente")!,
                    Fecha = DateTime.Parse((string)e.Element("fecha")!),
                    Valor = (decimal)e.Element("valor")!
                }).ToList();
            }
            catch { return new List<Pago>(); }
        }

        public void GuardarClientes()
        {
            var doc = new XDocument(new XElement("clientes",
                Clientes.Select(c => new XElement("cliente",
                    new XElement("NIT", c.NIT),
                    new XElement("nombre", c.Nombre),
                    new XElement("saldoAFavor", c.SaldoAFavor)
                ))
            ));
            doc.Save(_rutaClientes);
        }

        public void GuardarBancos()
        {
            var doc = new XDocument(new XElement("bancos",
                Bancos.Select(b => new XElement("banco",
                    new XElement("codigo", b.Codigo),
                    new XElement("nombre", b.Nombre)
                ))
            ));
            doc.Save(_rutaBancos);
        }

        public void GuardarFacturas()
        {
            var doc = new XDocument(new XElement("facturas",
                Facturas.Select(f => new XElement("factura",
                    new XElement("numeroFactura", f.NumeroFactura),
                    new XElement("NITCliente", f.NITCliente),
                    new XElement("fecha", f.Fecha.ToString("yyyy-MM-dd")),
                    new XElement("valor", f.Valor),
                    new XElement("saldoPendiente", f.SaldoPendiente),
                    new XElement("pagada", f.Pagada)
                ))
            ));
            doc.Save(_rutaFacturas);
        }

        public void GuardarPagos()
        {
            var doc = new XDocument(new XElement("pagos",
                Pagos.Select(p => new XElement("pago",
                    new XElement("codigoBanco", p.CodigoBanco),
                    new XElement("NITCliente", p.NITCliente),
                    new XElement("fecha", p.Fecha.ToString("yyyy-MM-dd")),
                    new XElement("valor", p.Valor)
                ))
            ));
            doc.Save(_rutaPagos);
        }

        public void LimpiarTodo()
        {
            // Limpiamos las listas en memoria
            Clientes.Clear();
            Bancos.Clear();
            Facturas.Clear();
            Pagos.Clear();

            // Sobreescribimos los archivos con listas vacías
            GuardarClientes();
            GuardarBancos();
            GuardarFacturas();
            GuardarPagos();
        }
    }
}