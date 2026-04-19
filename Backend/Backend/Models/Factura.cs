namespace Backend.Models
{
    public class Factura
    {
        public string NumeroFactura { get; set; } = string.Empty;
        public string NITCliente { get; set; } = string.Empty;
        public string Fecha { get; set; } = string.Empty; 
        public decimal Valor { get; set; }
        public decimal SaldoPendiente { get; set; }

    }
}
