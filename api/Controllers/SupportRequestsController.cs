using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupportFlow.Api.Data;
using SupportFlow.Api.Dtos;
using SupportFlow.Api.Models;

namespace SupportFlow.Api.Controllers;

[ApiController]
[Route("api/requests")]
public class SupportRequestsController(SupportFlowDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SupportRequest>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] RequestStatus? status)
    {
        var query = context.SupportRequests.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(request => request.Title.ToLower().Contains(term));
        }

        if (status.HasValue)
        {
            query = query.Where(request => request.Status == status.Value);
        }

        return Ok(await query.OrderByDescending(request => request.CreatedAt).ToListAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SupportRequest>> GetById(int id)
    {
        var request = await context.SupportRequests.AsNoTracking().FirstOrDefaultAsync(item => item.Id == id);
        return request is null ? NotFound() : Ok(request);
    }

    [HttpPost]
    public async Task<ActionResult<SupportRequest>> Create(CreateSupportRequestDto dto)
    {
        if (!HasRequiredText(dto.Title, dto.Description))
        {
            return InvalidTextFields();
        }

        var request = new SupportRequest
        {
            Title = dto.Title.Trim(),
            Description = dto.Description.Trim(),
            Status = dto.Status,
            Priority = dto.Priority,
            CreatedAt = DateTime.UtcNow
        };

        context.SupportRequests.Add(request);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = request.Id }, request);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<SupportRequest>> Update(int id, UpdateSupportRequestDto dto)
    {
        if (!HasRequiredText(dto.Title, dto.Description))
        {
            return InvalidTextFields();
        }

        var request = await context.SupportRequests.FindAsync(id);

        if (request is null)
        {
            return NotFound();
        }

        request.Title = dto.Title.Trim();
        request.Description = dto.Description.Trim();
        request.Status = dto.Status;
        request.Priority = dto.Priority;

        await context.SaveChangesAsync();
        return Ok(request);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var request = await context.SupportRequests.FindAsync(id);

        if (request is null)
        {
            return NotFound();
        }

        context.SupportRequests.Remove(request);
        await context.SaveChangesAsync();
        return NoContent();
    }

    private static bool HasRequiredText(string title, string description) =>
        !string.IsNullOrWhiteSpace(title) && !string.IsNullOrWhiteSpace(description);

    private ActionResult InvalidTextFields()
    {
        ModelState.AddModelError(nameof(CreateSupportRequestDto.Title), "O título é obrigatório.");
        ModelState.AddModelError(nameof(CreateSupportRequestDto.Description), "A descrição é obrigatória.");
        return ValidationProblem(ModelState);
    }
}
