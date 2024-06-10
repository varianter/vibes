using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class ConstraintsToProjectName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Project_CustomerId",
                table: "Project");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CompetenceConsultant",
                table: "CompetenceConsultant");

            migrationBuilder.DropIndex(
                name: "IX_CompetenceConsultant_ConsultantId",
                table: "CompetenceConsultant");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Project",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "GraduationYear",
                table: "Consultant",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_CompetenceConsultant",
                table: "CompetenceConsultant",
                columns: new[] { "ConsultantId", "CompetencesId" });

            migrationBuilder.CreateIndex(
                name: "IX_Project_CustomerId_Name",
                table: "Project",
                columns: new[] { "CustomerId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CompetenceConsultant_CompetencesId",
                table: "CompetenceConsultant",
                column: "CompetencesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Project_CustomerId_Name",
                table: "Project");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CompetenceConsultant",
                table: "CompetenceConsultant");

            migrationBuilder.DropIndex(
                name: "IX_CompetenceConsultant_CompetencesId",
                table: "CompetenceConsultant");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Project",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<int>(
                name: "GraduationYear",
                table: "Consultant",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CompetenceConsultant",
                table: "CompetenceConsultant",
                columns: new[] { "CompetencesId", "ConsultantId" });

            migrationBuilder.CreateIndex(
                name: "IX_Project_CustomerId",
                table: "Project",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_CompetenceConsultant_ConsultantId",
                table: "CompetenceConsultant",
                column: "ConsultantId");
        }
    }
}
