namespace Backend.Models
{
    public class Pago
    {
        public string CodigoBanco { get; set; } = string.Empty;
        public DateTime Fecha { get; set; }
        public string NITCliente { get; set; } = string.Empty;
        public decimal Valor { get; set; }
    }
}
    