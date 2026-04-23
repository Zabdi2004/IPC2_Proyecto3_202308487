using Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransaccionController : ControllerBase
    {
        private readonly TransaccionService _transaccionService;

        public TransaccionController(TransaccionService transaccionService)
        {
            _transaccionService = transaccionService;
        }

        // Recibe el archivo transac.xml con facturas y pagos
        // devuelve un XML con el conteo de operaciones procesadas,
        // duplicadas y con error para cada tipo
        [HttpPost("cargar")]
        public async Task<IActionResult> Cargar(IFormFile archivo)
        {
            if (archivo == null || archivo.Length == 0)
                return BadRequest("No se seleccionó ningún archivo.");

            try
            {
                using var reader = new StreamReader(archivo.OpenReadStream());
                string xmlContent = await reader.ReadToEndAsync();

                var xmlRespuesta = _transaccionService.ProcesarTransacciones(xmlContent);

                return Content(xmlRespuesta, "application/xml");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al procesar el archivo: {ex.Message}");
            }
        }
    }
}
