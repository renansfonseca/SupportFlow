using System.ComponentModel.DataAnnotations;
using SupportFlow.Api.Models;

namespace SupportFlow.Api.Dtos;

public class CreateSupportRequestDto
{
    [Required, MaxLength(120)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    public RequestStatus Status { get; set; } = RequestStatus.Open;

    public RequestPriority Priority { get; set; } = RequestPriority.Medium;
}
