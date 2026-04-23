var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<Backend.Repositories.Repositorio>();

// Scoped: una instancia nueva por cada petición HTTP
builder.Services.AddScoped<Backend.Services.ConfigService>();
builder.Services.AddScoped<Backend.Services.TransaccionService>();
builder.Services.AddScoped<Backend.Services.ConsultaService>();

// CORS: permite que React (localhost:5173) se comunique con el Backend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS debe ir antes de MapControllers
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();