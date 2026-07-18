using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupportFlow.Api.Data;
using SupportFlow.Api.Dtos;
using SupportFlow.Api.Models;

namespace SupportFlow.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController(SupportFlowDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<DashboardStatsDto>> GetStats()
    {
        var counts = await context.SupportRequests
            .AsNoTracking()
            .GroupBy(request => request.Status)
            .Select(group => new { Status = group.Key, Count = group.Count() })
            .ToDictionaryAsync(item => item.Status, item => item.Count);

        return Ok(new DashboardStatsDto(
            counts.GetValueOrDefault(RequestStatus.Open),
            counts.GetValueOrDefault(RequestStatus.InProgress),
            counts.GetValueOrDefault(RequestStatus.Completed)));
    }
}
