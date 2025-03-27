using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDisciplines : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DisciplineId",
                table: "Consultant",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Disciplines",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Disciplines", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Consultant",
                keyColumn: "Id",
                keyValue: 1,
                column: "DisciplineId",
                value: null);

            migrationBuilder.InsertData(
                table: "Disciplines",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { "app-development", "App-utvikling" },
                    { "counselling", "Rådgivning" },
                    { "data-engineer", "Data Engineer" },
                    { "dotnet", ".NET" },
                    { "frontend", "Frontend" },
                    { "jvm", "Java/JVM" },
                    { "platform", "Plattform" },
                    { "ppp", "Prosjekt/Produkt/Prosess" },
                    { "service-design", "Tjenestedesign" },
                    { "strategic-design", "Strategisk Design" },
                    { "ux-design", "UX Design" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Consultant_DisciplineId",
                table: "Consultant",
                column: "DisciplineId");

            migrationBuilder.AddForeignKey(
                name: "FK_Consultant_Disciplines_DisciplineId",
                table: "Consultant",
                column: "DisciplineId",
                principalTable: "Disciplines",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Consultant_Disciplines_DisciplineId",
                table: "Consultant");

            migrationBuilder.DropTable(
                name: "Disciplines");

            migrationBuilder.DropIndex(
                name: "IX_Consultant_DisciplineId",
                table: "Consultant");

            migrationBuilder.DropColumn(
                name: "DisciplineId",
                table: "Consultant");
        }
    }
}
