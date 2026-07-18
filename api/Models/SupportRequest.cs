using System.ComponentModel.DataAnnotations;

namespace SupportFlow.Api.Models;

public class SupportRequest
{
    public int Id { get; set; }

    [MaxLength(120)]
    public required string Title { get; set; }

    [MaxLength(1000)]
    public required string Description { get; set; }

    public RequestStatus Status { get; set; }

    public RequestPriority Priority { get; set; }

    public DateTime CreatedAt { get; set; }
}
