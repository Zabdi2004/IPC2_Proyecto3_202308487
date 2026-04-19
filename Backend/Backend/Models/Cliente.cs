namespace Backend.Models
{
    public class Cliente
    {
        public string NIT { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public decimal SaldoAFavor { get; set; } = 0;
    }
}
