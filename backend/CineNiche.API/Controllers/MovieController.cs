using System.Linq.Expressions;
using CineNiche.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using CineNiche.API.Services;


namespace CineNiche.API.Controllers
{
    [EnableCors("AllowFrontend")]
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MovieController : ControllerBase
    {
        private MoviesContext _movieContext;
        private readonly HtmlSanitizerService _sanitizer;
        public MovieController(MoviesContext temp, HtmlSanitizerService sanitizer)
        { 
            _movieContext = temp;
            _sanitizer = sanitizer;
        }

        [HttpGet("AllMovies")]
        public IActionResult GetMovies(int pageSize = 10, int pageNum = 1, [FromQuery] List<string>? genres = null)
        {
            // 🍪 Handle cookie (unchanged)
            string? favGenre = Request.Cookies["favoriteGenre"];
            Console.WriteLine("-------COOKIE-------\n" + favGenre);

            HttpContext.Response.Cookies.Append("favoriteGenre", "Action", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.Now.AddHours(1)
            });

            // 🌱 Start base query
            var query = _movieContext.MoviesTitles.AsQueryable();

            // 🎯 Dynamically apply genre filters
            if (genres != null && genres.Any())
            {
                var parameter = Expression.Parameter(typeof(MoviesTitle), "m");
                Expression? filter = null;

                foreach (var genre in genres)
                {
                    var property = Expression.PropertyOrField(parameter, genre);
                    var one = Expression.Constant(1);
                    var equals = Expression.Equal(property, one);

                    filter = filter == null ? equals : Expression.OrElse(filter, equals);
                }

                if (filter != null)
                {
                    var lambda = Expression.Lambda<Func<MoviesTitle, bool>>(filter, parameter);
                    query = query.Where(lambda);
                }
            }

            // 📦 Pagination
            var totalNumMovies = query.Count();

            var results = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // 🎁 Return response
            var response = new
            {
                Movies = results,
                TotalNumMovies = totalNumMovies
            };

            return Ok(response);
        }


        [HttpGet("GetMovieGenres")]
        public IActionResult GetMovieGenres()
        {
            var genres = new List<string>();

            // Get the raw connection from your existing EF Core context
            var connection = _movieContext.Database.GetDbConnection();

            connection.Open();

            using (var command = connection.CreateCommand())
            {
                command.CommandText = "PRAGMA table_info(movies_titles);";

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var columnName = reader.GetString(1);

                        // If first character is uppercase, consider it a genre
                        if (!string.IsNullOrEmpty(columnName) && char.IsUpper(columnName[0]))
                        {
                            genres.Add(columnName);
                        }
                    }
                }
            }
            return Ok(genres);
        }

        [HttpGet("SearchMovies")]
        public IActionResult SearchMovies(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Search query cannot be empty.");
            }

            var results = _movieContext.MoviesTitles
                .Where(m => m.Title != null && m.Title.ToLower().Contains(query.ToLower()))
                .ToList();

            return Ok(results);
        }


        [HttpPost("AddMovie")]
        public IActionResult AddMovie([FromBody] MoviesTitle newMovie)
        {
            var lastNumericId = _movieContext.MoviesTitles
                .AsEnumerable() // move query to in-memory
                .Where(m => m.ShowId.StartsWith("s"))
                .Select(m => m.ShowId.Substring(1))
                .Where(id => int.TryParse(id, out _))
                .Select(int.Parse)
                .DefaultIfEmpty(0)
                .Max();

            newMovie.ShowId = $"s{lastNumericId + 1}";

            // ✅ Sanitize key fields
            newMovie.Title = _sanitizer.Sanitize(newMovie.Title);
            newMovie.Description = _sanitizer.Sanitize(newMovie.Description);
            newMovie.Director = _sanitizer.Sanitize(newMovie.Director);
            newMovie.Cast = _sanitizer.Sanitize(newMovie.Cast);
            newMovie.Country = _sanitizer.Sanitize(newMovie.Country);
            newMovie.Duration = _sanitizer.Sanitize(newMovie.Duration);
            newMovie.Type = _sanitizer.Sanitize(newMovie.Type);

            _movieContext.MoviesTitles.Add(newMovie);
            _movieContext.SaveChanges();

            return Ok(newMovie);
        }


        [HttpPut("UpdateMovie/{showId}")]
        public IActionResult UpdateMovie(string showId, [FromBody] MoviesTitle updatedMovie)
        {
            var existingMovie = _movieContext.MoviesTitles.Find(showId);

            // Standard fields
            existingMovie.ShowId = updatedMovie.ShowId;
            existingMovie.Type = _sanitizer.Sanitize(updatedMovie.Type);
            existingMovie.Title = _sanitizer.Sanitize(updatedMovie.Title);
            existingMovie.Director = _sanitizer.Sanitize(updatedMovie.Director);
            existingMovie.Cast = _sanitizer.Sanitize(updatedMovie.Cast);
            existingMovie.Country = _sanitizer.Sanitize(updatedMovie.Country);
            existingMovie.ReleaseYear = updatedMovie.ReleaseYear;
            existingMovie.Rating = _sanitizer.Sanitize(updatedMovie.Rating);
            existingMovie.Duration = _sanitizer.Sanitize(updatedMovie.Duration);
            existingMovie.Description = _sanitizer.Sanitize(updatedMovie.Description);

            // Genre flags
            existingMovie.Action = updatedMovie.Action;
            existingMovie.Adventure = updatedMovie.Adventure;
            existingMovie.AnimeSeriesInternationalTvShows = updatedMovie.AnimeSeriesInternationalTvShows;
            existingMovie.BritishTvShowsDocuseriesInternationalTvShows = updatedMovie.BritishTvShowsDocuseriesInternationalTvShows;
            existingMovie.Children = updatedMovie.Children;
            existingMovie.Comedies = updatedMovie.Comedies;
            existingMovie.ComediesDramasInternationalMovies = updatedMovie.ComediesDramasInternationalMovies;
            existingMovie.ComediesInternationalMovies = updatedMovie.ComediesInternationalMovies;
            existingMovie.ComediesRomanticMovies = updatedMovie.ComediesRomanticMovies;
            existingMovie.CrimeTvShowsDocuseries = updatedMovie.CrimeTvShowsDocuseries;
            existingMovie.Documentaries = updatedMovie.Documentaries;
            existingMovie.DocumentariesInternationalMovies = updatedMovie.DocumentariesInternationalMovies;
            existingMovie.Docuseries = updatedMovie.Docuseries;
            existingMovie.Dramas = updatedMovie.Dramas;
            existingMovie.DramasInternationalMovies = updatedMovie.DramasInternationalMovies;
            existingMovie.DramasRomanticMovies = updatedMovie.DramasRomanticMovies;
            existingMovie.FamilyMovies = updatedMovie.FamilyMovies;
            existingMovie.Fantasy = updatedMovie.Fantasy;
            existingMovie.HorrorMovies = updatedMovie.HorrorMovies;
            existingMovie.InternationalMoviesThrillers = updatedMovie.InternationalMoviesThrillers;
            existingMovie.InternationalTvShowsRomanticTvShowsTvDramas = updatedMovie.InternationalTvShowsRomanticTvShowsTvDramas;
            existingMovie.KidsTv = updatedMovie.KidsTv;
            existingMovie.LanguageTvShows = updatedMovie.LanguageTvShows;
            existingMovie.Musicals = updatedMovie.Musicals;
            existingMovie.NatureTv = updatedMovie.NatureTv;
            existingMovie.RealityTv = updatedMovie.RealityTv;
            existingMovie.Spirituality = updatedMovie.Spirituality;
            existingMovie.TvAction = updatedMovie.TvAction;
            existingMovie.TvComedies = updatedMovie.TvComedies;
            existingMovie.TvDramas = updatedMovie.TvDramas;
            existingMovie.TalkShowsTvComedies = updatedMovie.TalkShowsTvComedies;
            existingMovie.Thrillers = updatedMovie.Thrillers;

            _movieContext.MoviesTitles.Update(existingMovie);
            _movieContext.SaveChanges();

            return Ok(existingMovie);
        }

        [HttpDelete("DeleteMovie/{showId}")]
        public IActionResult DeleteMovie(string showId)
        {
            var movie = _movieContext.MoviesTitles.Find(showId);

            if (movie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            _movieContext.MoviesTitles.Remove(movie);
            _movieContext.SaveChanges();

            return NoContent();
        }

        [HttpGet("{id}")]
        public IActionResult GetMovieById(string id)
        {
            var movie = _movieContext.MoviesTitles.FirstOrDefault(m => m.ShowId == id);
            if (movie == null)
            {
                return NotFound();
            }

            // Get all int? properties that represent genres (value == 1)
            var categories = movie.GetType()
                .GetProperties()
                .Where(prop => prop.PropertyType == typeof(int?) && prop.GetValue(movie) is int value && value == 1)
                .Select(prop => prop.Name)
                .ToList();

            var result = new
            {
                movie.ShowId,
                movie.Type,
                movie.Title,
                movie.Director,
                movie.Cast,
                movie.Country,
                movie.ReleaseYear,
                movie.Rating,
                movie.Duration,
                movie.Description,
                Categories = categories
            };

            return Ok(result);
        }
    }
}
