using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace CineNiche.API.Data;

public partial class MoviesContext : DbContext
{
    public MoviesContext()
    {
    }

    public MoviesContext(DbContextOptions<MoviesContext> options)
        : base(options)
    {
    }

    public virtual DbSet<MoviesRating> MoviesRatings { get; set; }

    public virtual DbSet<MoviesTitle> MoviesTitles { get; set; }

    public virtual DbSet<MoviesUser> MoviesUsers { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlite("Data Source=Movies.db");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // 🎬 MoviesTitle
        modelBuilder.Entity<MoviesTitle>(entity =>
        {
            entity.ToTable("movies_titles");

            entity.HasKey(e => e.ShowId);

            entity.Property(e => e.ShowId).HasColumnName("ShowId");

            entity.Property(e => e.Title).HasColumnName("Title");
            entity.Property(e => e.Type).HasColumnName("Type");
            entity.Property(e => e.Director).HasColumnName("Director");
            entity.Property(e => e.Cast).HasColumnName("Cast");
            entity.Property(e => e.Country).HasColumnName("Country");
            entity.Property(e => e.ReleaseYear).HasColumnName("ReleaseYear");
            entity.Property(e => e.Rating).HasColumnName("Rating");
            entity.Property(e => e.Duration).HasColumnName("Duration");
            entity.Property(e => e.Description).HasColumnName("Description");

            entity.Property(e => e.Action).HasColumnName("Action");
            entity.Property(e => e.Adventure).HasColumnName("Adventure");
            entity.Property(e => e.AnimeSeriesInternationalTvShows).HasColumnName("AnimeSeriesInternationalTvShows");
            entity.Property(e => e.BritishTvShowsDocuseriesInternationalTvShows).HasColumnName("BritishTvShowsDocuseriesInternationalTvShows");
            entity.Property(e => e.Children).HasColumnName("Children");
            entity.Property(e => e.Comedies).HasColumnName("Comedies");
            entity.Property(e => e.ComediesDramasInternationalMovies).HasColumnName("ComediesDramasInternationalMovies");
            entity.Property(e => e.ComediesInternationalMovies).HasColumnName("ComediesInternationalMovies");
            entity.Property(e => e.ComediesRomanticMovies).HasColumnName("ComediesRomanticMovies");
            entity.Property(e => e.CrimeTvShowsDocuseries).HasColumnName("CrimeTvShowsDocuseries");
            entity.Property(e => e.Documentaries).HasColumnName("Documentaries");
            entity.Property(e => e.DocumentariesInternationalMovies).HasColumnName("DocumentariesInternationalMovies");
            entity.Property(e => e.Docuseries).HasColumnName("Docuseries");
            entity.Property(e => e.Dramas).HasColumnName("Dramas");
            entity.Property(e => e.DramasInternationalMovies).HasColumnName("DramasInternationalMovies");
            entity.Property(e => e.DramasRomanticMovies).HasColumnName("DramasRomanticMovies");
            entity.Property(e => e.FamilyMovies).HasColumnName("FamilyMovies");
            entity.Property(e => e.Fantasy).HasColumnName("Fantasy");
            entity.Property(e => e.HorrorMovies).HasColumnName("HorrorMovies");
            entity.Property(e => e.InternationalMoviesThrillers).HasColumnName("InternationalMoviesThrillers");
            entity.Property(e => e.InternationalTvShowsRomanticTvShowsTvDramas).HasColumnName("InternationalTvShowsRomanticTvShowsTvDramas");
            entity.Property(e => e.KidsTv).HasColumnName("KidsTv");
            entity.Property(e => e.LanguageTvShows).HasColumnName("LanguageTvShows");
            entity.Property(e => e.Musicals).HasColumnName("Musicals");
            entity.Property(e => e.NatureTv).HasColumnName("NatureTv");
            entity.Property(e => e.RealityTv).HasColumnName("RealityTv");
            entity.Property(e => e.Spirituality).HasColumnName("Spirituality");
            entity.Property(e => e.TvAction).HasColumnName("TvAction");
            entity.Property(e => e.TvComedies).HasColumnName("TvComedies");
            entity.Property(e => e.TvDramas).HasColumnName("TvDramas");
            entity.Property(e => e.TalkShowsTvComedies).HasColumnName("TalkShowsTvComedies");
            entity.Property(e => e.Thrillers).HasColumnName("Thrillers");

            entity.HasMany(e => e.Ratings)
                  .WithOne(r => r.MoviesTitle)
                  .HasForeignKey(r => r.ShowId);
        });

        // 👤 MoviesUser
        modelBuilder.Entity<MoviesUser>(entity =>
        {
            entity.ToTable("movies_users");

            entity.HasKey(e => e.UserId);

            entity.Property(e => e.UserId).HasColumnName("UserId");
            entity.Property(e => e.Name).HasColumnName("Name");
            entity.Property(e => e.Phone).HasColumnName("Phone");
            entity.Property(e => e.Email).HasColumnName("Email");
            entity.Property(e => e.Age).HasColumnName("Age");
            entity.Property(e => e.Gender).HasColumnName("Gender");
            entity.Property(e => e.Netflix).HasColumnName("Netflix");
            entity.Property(e => e.AmazonPrime).HasColumnName("AmazonPrime");
            entity.Property(e => e.Disney).HasColumnName("Disney");
            entity.Property(e => e.Paramount).HasColumnName("Paramount");
            entity.Property(e => e.Max).HasColumnName("Max");
            entity.Property(e => e.Hulu).HasColumnName("Hulu");
            entity.Property(e => e.AppleTv).HasColumnName("AppleTV");
            entity.Property(e => e.Peacock).HasColumnName("Peacock");
            entity.Property(e => e.City).HasColumnName("City");
            entity.Property(e => e.State).HasColumnName("State");
            entity.Property(e => e.Zip).HasColumnName("Zip");

            entity.HasMany(u => u.Ratings)
                  .WithOne(r => r.MoviesUser)
                  .HasForeignKey(r => r.UserId);
        });

        // ⭐ MoviesRating
        modelBuilder.Entity<MoviesRating>(entity =>
        {
            entity.ToTable("movies_ratings");

            entity.HasKey(e => new { e.UserId, e.ShowId });

            entity.Property(e => e.UserId).HasColumnName("UserId");
            entity.Property(e => e.ShowId).HasColumnName("ShowId");
            entity.Property(e => e.Rating).HasColumnName("Rating");

            // Foreign keys are configured in MoviesUser and MoviesTitle above
        });

        OnModelCreatingPartial(modelBuilder);
    }


    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
