namespace Backend.Models
{
    public class Pago
    {
        public int CodigoBanco { get; set; }
        public string Fecha { get; set; } = string.Empty;
        public string NITCliente { get; set; } = string.Empty;
        public decimal Valor { get; set; }
    }
}
