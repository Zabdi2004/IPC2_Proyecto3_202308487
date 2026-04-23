using Backend.Models;
using Backend.Repositories;
using System.Text;
using System.Xml.Linq;

namespace Backend.Services
{
    public class ConfigService
    {
        private readonly Repositorio _repositorio;

        public ConfigService(Repositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public string CargarConfiguracion(string xmlContent)
        {

            XDocument doc = XDocument.Parse(xmlContent);

            int clientesNuevos = 0;
            int clientesActualizados = 0;
            int bancosNuevos = 0;
            int bancosActualizados = 0;

            // Procesar Clientes 
            var clientesXml = doc.Root?.Element("clientes")?.Elements("cliente");
            if (clientesXml != null)
            {
                foreach (var item in clientesXml)
                {
                    string nit = item.Element("NIT")?.Value ?? "";
                    string nombre = item.Element("nombre")?.Value ?? "";

                    var clienteExistente = _repositorio.Clientes
                        .FirstOrDefault(c => c.NIT == nit);

                    if (clienteExistente != null)
                    {
                        // Si ya existe solo actualizamos su nombre
                        // el SaldoAFavor se conserva intacto
                        clienteExistente.Nombre = nombre;
                        clientesActualizados++;
                    }
                    else
                    {
                        // Si no existe lo creamos con saldo en cero
                        _repositorio.Clientes.Add(new Cliente
                        {
                            NIT = nit,
                            Nombre = nombre,
                            SaldoAFavor = 0
                        });
                        clientesNuevos++;
                    }
                }
            }

            // Procesar Bancos
            var bancosXml = doc.Root?.Element("bancos")?.Elements("banco");
            if (bancosXml != null)
            {
                foreach (var item in bancosXml)
                {
                    string codigo = item.Element("codigo")?.Value ?? "";
                    string nombre = item.Element("nombre")?.Value ?? "";

                    // Buscamos por código, que es el identificador único del banco
                    var bancoExistente = _repositorio.Bancos
                        .FirstOrDefault(b => b.Codigo == codigo);

                    if (bancoExistente != null)
                    {
                        bancoExistente.Nombre = nombre;
                        bancosActualizados++;
                    }
                    else
                    {
                        _repositorio.Bancos.Add(new Banco
                        {
                            Codigo = codigo,
                            Nombre = nombre
                        });
                        bancosNuevos++;
                    }
                }
            }

            // Generar XML de respuesta
            XDocument respuestaXML = new XDocument(
                new XDeclaration("1.0", "utf-8", "yes"),
                new XElement("respuesta",
                    new XElement("clientes",
                        new XElement("creados", clientesNuevos),
                        new XElement("actualizados", clientesActualizados)
                    ),
                    new XElement("bancos",
                        new XElement("creados", bancosNuevos),
                        new XElement("actualizados", bancosActualizados)
                    )
                )
            );

            // Usamos Utf8StringWriter para forzar que el XML se genere
            // en UTF-8 real, ya que StringWriter por defecto usa UTF-16
            // lo que causaría inconsistencia con la declaración del XML
            var sb = new StringBuilder();
            using (var writer = new Utf8StringWriter(sb))
            {
                respuestaXML.Save(writer);
            }

            return sb.ToString();
        }
    }

    // Clase auxiliar que sobreescribe el encoding por defecto de StringWriter
    // garantizando que el XML de respuesta siempre salga en UTF-8
    public class Utf8StringWriter : StringWriter
    {
        public Utf8StringWriter(StringBuilder sb) : base(sb) { }
        public override Encoding Encoding => Encoding.UTF8;
    }
}