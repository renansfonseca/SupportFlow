using Microsoft.EntityFrameworkCore;
using SupportFlow.Api.Models;

namespace SupportFlow.Api.Data;

public class SupportFlowDbContext(DbContextOptions<SupportFlowDbContext> options)
    : DbContext(options)
{
    public DbSet<SupportRequest> SupportRequests => Set<SupportRequest>();
}
