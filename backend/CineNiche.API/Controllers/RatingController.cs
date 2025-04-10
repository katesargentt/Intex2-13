using CineNiche.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CineNiche.API.DTOs;


namespace CineNiche.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Make sure only logged-in users can rate
    public class RatingController : ControllerBase
    {
        private readonly MoviesContext _context;

        public RatingController(MoviesContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> PostRating([FromBody] RatingDto dto)
        {
            try
            {
                Console.WriteLine($"📩 POST Rating received: ShowId = {dto.ShowId}, Rating = {dto.Rating}");

                var identityUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                Console.WriteLine($"✅ User ID claim found: {identityUserId}");

                var user = await _context.MoviesUsers.FirstOrDefaultAsync(u => u.IdentityUserId == identityUserId);

                if (user == null)
                {
                    Console.WriteLine($"❌ No MoviesUser found for Identity GUID: {identityUserId}");
                    return Unauthorized("No user found for this identity.");
                }

                var existing = await _context.MoviesRatings
                    .FirstOrDefaultAsync(r => r.ShowId == dto.ShowId && r.UserId == user.UserId);

                if (existing != null)
                {
                    existing.Rating = dto.Rating;
                    _context.MoviesRatings.Update(existing);
                    Console.WriteLine($"🔄 Updated existing rating to {dto.Rating}");
                }
                else
                {
                    var newRating = new MoviesRating
                    {
                        UserId = user.UserId,
                        ShowId = dto.ShowId,
                        Rating = dto.Rating
                    };
                    _context.MoviesRatings.Add(newRating);
                    Console.WriteLine($"➕ Added new rating");
                }

                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"🔥 Error in PostRating: {ex.Message}");
                return StatusCode(500, "Something went wrong");
            }
        }




        [HttpGet("{showId}")]
        public async Task<IActionResult> GetRating(string showId)
        {
            try
            {
                Console.WriteLine($"📥 GET Rating for ShowId = {showId}");

                int userId = GetCurrentUserId();
                Console.WriteLine($"👤 UserId = {userId}");

                var rating = await _context.MoviesRatings
                    .FirstOrDefaultAsync(r => r.ShowId == showId && r.UserId == userId);

                Console.WriteLine(rating != null
                    ? $"✅ Found rating: {rating.Rating}"
                    : "❌ No rating found");

                return Ok(new { rating = rating?.Rating });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"🔥 Error in GetRating: {ex.Message}");
                return StatusCode(500, "Error retrieving rating.");
            }
        }


        private int GetCurrentUserId()
        {
            var identityUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(identityUserId))
                throw new UnauthorizedAccessException("User not logged in.");

            var user = _context.MoviesUsers
                .FirstOrDefault(u => u.IdentityUserId == identityUserId);

            if (user == null)
                throw new UnauthorizedAccessException("No matching MoviesUser found.");

            return user.UserId;
        }


    }
}
