using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CineNiche.API.Migrations.Movies
{
    /// <inheritdoc />
    public partial class AddIdentityUserIdToMoviesUser2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IdentityUserId",
                table: "movies_users",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdentityUserId",
                table: "movies_users");
        }
    }
}
