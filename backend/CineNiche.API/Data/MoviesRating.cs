using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CineNiche.API.Data;

public partial class MoviesRating
{
    [Key, Column(Order = 0)]
    public int UserId { get; set; }

    [Key, Column(Order = 1)]
    public string ShowId { get; set; } = default!;

    public int Rating { get; set; }

    public MoviesUser? MoviesUser { get; set; }
    public MoviesTitle? MoviesTitle { get; set; }
}
