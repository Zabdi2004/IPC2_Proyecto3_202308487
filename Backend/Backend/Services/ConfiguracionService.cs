using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class ConfiguracionService
    {

        private readonly Repositorio _repositorio;

        public ConfiguracionService(Repositorio repositorio)
        {
            _repositorio = repositorio;
        }

    }
}
