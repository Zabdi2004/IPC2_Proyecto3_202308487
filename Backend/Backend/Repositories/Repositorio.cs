using Backend.Models;
using System.Security.Cryptography;
using System.Xml.Linq;

namespace Backend.Repositories
{
    public class Repositorio
    {
        // Rutas de los archivos XML
        private readonly string _rutaClientes = "/Data/clientes.xml";
        private readonly string _rutaBancos = "/Data/bancos.xml";
        private readonly string _rutaFacturas = "/Data/facturas.xml";
        private readonly string _rutaPagos = "/Data/pagos.xml";


        public Repositorio() 
        {
            InicializarXml(_rutaClientes, "clientes");
            InicializarXml(_rutaBancos, "bancos");
            InicializarXml(_rutaFacturas, "facturas");
            InicializarXml(_rutaPagos, "pagos");
        }

        private void InicializarXml(string ruta, string raiz)
        {
            if (!File.Exists(ruta))
            {
                Directory.CreateDirectory("Data");
                new XDocument(new XElement(raiz)).Save(ruta);

            }
        }
    }

}
