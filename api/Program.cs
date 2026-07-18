using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using SupportFlow.Api.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "A conexão PostgreSQL 'DefaultConnection' não foi configurada. " +
        "Configure-a com dotnet user-secrets no desenvolvimento ou pela variável de ambiente " +
        "ConnectionStrings__DefaultConnection em produção.");
}

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddDbContext<SupportFlowDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("Frontend");
app.MapControllers();
app.MapGet("/health", () => Results.Ok());

await DbInitializer.InitializeAsync(app.Services);

app.Run();
