using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Repositories;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResetController : ControllerBase
    {
        private readonly Repositorio _repositorio;

        public ResetController(Repositorio repositorio)
        {
            _repositorio = repositorio;
        }

        // Limpia todas las listas en memoria, devuelve el sistema al estado inicial sin datos
        [HttpPost("limpiar")]
        public IActionResult Limpiar()
        {
            _repositorio.LimpiarTodo();
            return Ok(new { mensaje = "Datos reseteados correctamente." });
        }
    }
}
