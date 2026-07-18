using Microsoft.EntityFrameworkCore;
using SupportFlow.Api.Models;

namespace SupportFlow.Api.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<SupportFlowDbContext>();

        context.Database.Migrate();

        if (await context.SupportRequests.AnyAsync())
        {
            return;
        }

        var now = DateTime.UtcNow;

        context.SupportRequests.AddRange(
            new SupportRequest
            {
                Title = "Erro ao emitir relatório mensal",
                Description = "O relatório financeiro não conclui a geração para o mês atual.",
                Status = RequestStatus.Open,
                Priority = RequestPriority.High,
                CreatedAt = now.AddHours(-3)
            },
            new SupportRequest
            {
                Title = "Atualização de dados cadastrais",
                Description = "Solicitação para alterar o endereço e o telefone da unidade comercial.",
                Status = RequestStatus.InProgress,
                Priority = RequestPriority.Medium,
                CreatedAt = now.AddDays(-1)
            },
            new SupportRequest
            {
                Title = "Acesso ao painel de indicadores",
                Description = "Novo colaborador precisa de acesso ao painel da equipe de operações.",
                Status = RequestStatus.Open,
                Priority = RequestPriority.Low,
                CreatedAt = now.AddDays(-2)
            },
            new SupportRequest
            {
                Title = "Divergência no valor da fatura",
                Description = "O valor exibido na fatura é diferente do acordado na proposta comercial.",
                Status = RequestStatus.InProgress,
                Priority = RequestPriority.High,
                CreatedAt = now.AddDays(-3)
            },
            new SupportRequest
            {
                Title = "Configuração de notificações",
                Description = "Ativação das notificações por e-mail concluída para todos os gestores.",
                Status = RequestStatus.Completed,
                Priority = RequestPriority.Medium,
                CreatedAt = now.AddDays(-5)
            },
            new SupportRequest
            {
                Title = "Importação de contatos",
                Description = "Planilha de contatos validada e importada com sucesso.",
                Status = RequestStatus.Completed,
                Priority = RequestPriority.Low,
                CreatedAt = now.AddDays(-7)
            });

        await context.SaveChangesAsync();
    }
}
