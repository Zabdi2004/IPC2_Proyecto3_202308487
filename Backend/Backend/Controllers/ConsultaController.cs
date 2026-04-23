using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Services;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsultaController : ControllerBase
    {
        private readonly ConsultaService _consultaService;

        public ConsultaController(ConsultaService consultaService)
        {
            _consultaService = consultaService;
        }

        // Devuelve la lista completa de clientes ordenados por NIT
        [HttpGet("clientes")]
        public IActionResult GetClientes()
        {
            return Ok(_consultaService.ObtenerTodosLosClientes());
        }

        // Devuelve el estado de cuenta de un cliente específico
        [HttpGet("cliente/{nit}")]
        public IActionResult GetEstadoCuenta(string nit)
        {
            var resultado = _consultaService.ObtenerEstadoCuenta(nit);

            // Si el NIT no existe devolvemos 404 con un mensaje descriptivo
            if (resultado == null)
                return NotFound(new { mensaje = "Cliente no encontrado" });

            return Ok(resultado);
        }

        // Devuelve los ingresos agrupados por banco para los últimos 3 meses
        [HttpGet("ingresos-bancos")]
        public IActionResult GetIngresosBancos([FromQuery] int mes, [FromQuery] int anio)
        {
            // Validación de rango de fechas para evitar consultas innecesarias
            if (mes < 1 || mes > 12 || anio < 2000)
                return BadRequest(new { mensaje = "Fecha inválida" });

            var resultado = _consultaService.ObtenerIngresosPorBanco(mes, anio);
            return Ok(resultado);
        }
    }
}
