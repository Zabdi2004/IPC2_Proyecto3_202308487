using Backend.Models;

namespace Backend.Repositories
{
    public class Repositorio
    {
        public List<Cliente> Clientes { get; set; }
        public List<Banco> Bancos { get; set; }
        public List<Factura> Facturas { get; set; }
        public List<Pago> Pagos { get; set; }

        public Repositorio()
        {
            Clientes = new List<Cliente>();
            Bancos = new List<Banco>();
            Facturas = new List<Factura>();
            Pagos = new List<Pago>();
        }
    }
}