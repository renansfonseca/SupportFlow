using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using SupportFlow.Api.Data;

var builder = WebApplication.CreateBuilder(args);

var port = builder.Configuration["PORT"];

if (!string.IsNullOrWhiteSpace(port))
{
    if (!int.TryParse(port, out var portNumber) || portNumber is < 1 or > 65535)
    {
        throw new InvalidOperationException(
            "A variável PORT deve conter um número de porta válido entre 1 e 65535.");
    }

    builder.WebHost.UseUrls($"http://0.0.0.0:{portNumber}");
}

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

var frontendUrl = builder.Environment.IsDevelopment()
    ? "http://localhost:3000"
    : builder.Configuration["FrontendUrl"];

if (string.IsNullOrWhiteSpace(frontendUrl))
{
    throw new InvalidOperationException(
        "A origem do frontend não foi configurada. Defina a variável de ambiente FrontendUrl em produção.");
}

var allowedOrigin = frontendUrl.Trim().TrimEnd('/');

if (!Uri.TryCreate(allowedOrigin, UriKind.Absolute, out var frontendUri)
    || (frontendUri.Scheme != Uri.UriSchemeHttp && frontendUri.Scheme != Uri.UriSchemeHttps)
    || !string.Equals(
        allowedOrigin,
        frontendUri.GetLeftPart(UriPartial.Authority),
        StringComparison.OrdinalIgnoreCase))
{
    throw new InvalidOperationException(
        "FrontendUrl deve conter uma origem HTTP ou HTTPS válida, sem caminho, query ou wildcard.");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy
            .WithOrigins(allowedOrigin)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("Frontend");
app.MapControllers();
app.MapGet("/health", () => Results.Ok());

await DbInitializer.InitializeAsync(app.Services);

app.Run();
