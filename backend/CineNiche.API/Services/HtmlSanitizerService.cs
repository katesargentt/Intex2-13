using Ganss.Xss;

namespace CineNiche.API.Services
{
    public class HtmlSanitizerService
    {
        private readonly HtmlSanitizer _sanitizer;

        public HtmlSanitizerService()
        {
            _sanitizer = new HtmlSanitizer();
            // Optional: allow specific formatting tags
            _sanitizer.AllowedTags.Add("b");
            _sanitizer.AllowedTags.Add("i");
        }

        public string Sanitize(string? input)
        {
            return input == null ? string.Empty : _sanitizer.Sanitize(input);
        }
    }
}
