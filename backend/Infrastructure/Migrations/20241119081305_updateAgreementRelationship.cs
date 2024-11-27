using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updateAgreementRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Agreements_Project_EngagementId",
                table: "Agreements");

            migrationBuilder.DropIndex(
                name: "IX_Agreements_EngagementId",
                table: "Agreements");

            migrationBuilder.AlterColumn<int>(
                name: "EngagementId",
                table: "Agreements",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "CustomerId",
                table: "Agreements",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Agreements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Agreements_CustomerId",
                table: "Agreements",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Agreements_EngagementId",
                table: "Agreements",
                column: "EngagementId");

            migrationBuilder.AddForeignKey(
                name: "FK_Agreements_Customer_CustomerId",
                table: "Agreements",
                column: "CustomerId",
                principalTable: "Customer",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Agreements_Project_EngagementId",
                table: "Agreements",
                column: "EngagementId",
                principalTable: "Project",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Agreements_Customer_CustomerId",
                table: "Agreements");

            migrationBuilder.DropForeignKey(
                name: "FK_Agreements_Project_EngagementId",
                table: "Agreements");

            migrationBuilder.DropIndex(
                name: "IX_Agreements_CustomerId",
                table: "Agreements");

            migrationBuilder.DropIndex(
                name: "IX_Agreements_EngagementId",
                table: "Agreements");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                table: "Agreements");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Agreements");

            migrationBuilder.AlterColumn<int>(
                name: "EngagementId",
                table: "Agreements",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Agreements_EngagementId",
                table: "Agreements",
                column: "EngagementId");

            migrationBuilder.AddForeignKey(
                name: "FK_Agreements_Project_EngagementId",
                table: "Agreements",
                column: "EngagementId",
                principalTable: "Project",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
