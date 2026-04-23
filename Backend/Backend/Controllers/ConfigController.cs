using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Backend.Services;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigController : ControllerBase
    {
        private readonly ConfigService _configService;

        public ConfigController(ConfigService configService)
        {
            _configService = configService;
        }

        // Recibe el archivo config.xml desde el Frontend
        // y devuelve un XML con el resumen de clientes y bancos procesados
        [HttpPost("cargar")]
        public async Task<IActionResult> Cargar(IFormFile archivo)
        {
            if (archivo == null || archivo.Length == 0)
                return BadRequest("No se seleccionó ningún archivo.");

            try
            {
                // Leemos el archivo como texto plano para pasárselo al servicio
                // el controlador no procesa el XML, solo lo transporta
                using var reader = new StreamReader(archivo.OpenReadStream());
                string xmlContent = await reader.ReadToEndAsync();

                var xmlRespuesta = _configService.CargarConfiguracion(xmlContent);

                return Content(xmlRespuesta, "application/xml");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al procesar el archivo: {ex.Message}");
            }
        }
    }
}
