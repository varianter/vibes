using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Competence",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Competence", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Organization",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UrlKey = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NumberOfVacationDaysInYear = table.Column<int>(type: "int", nullable: false),
                    HasVacationInChristmas = table.Column<bool>(type: "bit", nullable: false),
                    HoursPerWorkday = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Organization", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Absence",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExcludeFromBillRate = table.Column<bool>(type: "bit", nullable: false),
                    OrganizationId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Absence", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Absence_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Customer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OrganizationId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Customer_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Department",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Hotkey = table.Column<int>(type: "int", nullable: true),
                    OrganizationId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Department", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Department_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Project",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerId = table.Column<int>(type: "int", nullable: false),
                    State = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Project", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Project_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Consultant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DepartmentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Degree = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GraduationYear = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Consultant", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Consultant_Department_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Department",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CompetenceConsultant",
                columns: table => new
                {
                    CompetencesId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ConsultantId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompetenceConsultant", x => new { x.CompetencesId, x.ConsultantId });
                    table.ForeignKey(
                        name: "FK_CompetenceConsultant_Competence_CompetencesId",
                        column: x => x.CompetencesId,
                        principalTable: "Competence",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CompetenceConsultant_Consultant_ConsultantId",
                        column: x => x.ConsultantId,
                        principalTable: "Consultant",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlannedAbsence",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AbsenceId = table.Column<int>(type: "int", nullable: false),
                    ConsultantId = table.Column<int>(type: "int", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    WeekNumber = table.Column<int>(type: "int", nullable: false),
                    Hours = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlannedAbsence", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlannedAbsence_Absence_AbsenceId",
                        column: x => x.AbsenceId,
                        principalTable: "Absence",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PlannedAbsence_Consultant_ConsultantId",
                        column: x => x.ConsultantId,
                        principalTable: "Consultant",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Staffing",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectId = table.Column<int>(type: "int", nullable: false),
                    ConsultantId = table.Column<int>(type: "int", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Week = table.Column<int>(type: "int", nullable: false),
                    Hours = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Staffing", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Staffing_Consultant_ConsultantId",
                        column: x => x.ConsultantId,
                        principalTable: "Consultant",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Staffing_Project_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Project",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Vacation",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConsultantId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vacation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vacation_Consultant_ConsultantId",
                        column: x => x.ConsultantId,
                        principalTable: "Consultant",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Competence",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { "backend", "Backend" },
                    { "design", "Design" },
                    { "frontend", "Frontend" },
                    { "project-mgmt", "Project Management" }
                });

            migrationBuilder.InsertData(
                table: "Organization",
                columns: new[] { "Id", "Country", "HasVacationInChristmas", "HoursPerWorkday", "Name", "NumberOfVacationDaysInYear", "UrlKey" },
                values: new object[] { "variant-as", "norway", true, 7.5, "Variant AS", 25, "variant-as" });

            migrationBuilder.InsertData(
                table: "Department",
                columns: new[] { "Id", "Hotkey", "Name", "OrganizationId" },
                values: new object[] { "trondheim", null, "Trondheim", "variant-as" });

            migrationBuilder.InsertData(
                table: "Consultant",
                columns: new[] { "Id", "Degree", "DepartmentId", "Email", "EndDate", "GraduationYear", "Name", "StartDate" },
                values: new object[] { 1, "Master", "trondheim", "j@variant.no", null, 2019, "Jonas", new DateTime(2020, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.CreateIndex(
                name: "IX_Absence_OrganizationId",
                table: "Absence",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_CompetenceConsultant_ConsultantId",
                table: "CompetenceConsultant",
                column: "ConsultantId");

            migrationBuilder.CreateIndex(
                name: "IX_Consultant_DepartmentId",
                table: "Consultant",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_OrganizationId",
                table: "Customer",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Department_OrganizationId",
                table: "Department",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_PlannedAbsence_AbsenceId",
                table: "PlannedAbsence",
                column: "AbsenceId");

            migrationBuilder.CreateIndex(
                name: "IX_PlannedAbsence_ConsultantId",
                table: "PlannedAbsence",
                column: "ConsultantId");

            migrationBuilder.CreateIndex(
                name: "IX_Project_CustomerId",
                table: "Project",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Staffing_ConsultantId",
                table: "Staffing",
                column: "ConsultantId");

            migrationBuilder.CreateIndex(
                name: "IX_Staffing_ProjectId",
                table: "Staffing",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Vacation_ConsultantId",
                table: "Vacation",
                column: "ConsultantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompetenceConsultant");

            migrationBuilder.DropTable(
                name: "PlannedAbsence");

            migrationBuilder.DropTable(
                name: "Staffing");

            migrationBuilder.DropTable(
                name: "Vacation");

            migrationBuilder.DropTable(
                name: "Competence");

            migrationBuilder.DropTable(
                name: "Absence");

            migrationBuilder.DropTable(
                name: "Project");

            migrationBuilder.DropTable(
                name: "Consultant");

            migrationBuilder.DropTable(
                name: "Customer");

            migrationBuilder.DropTable(
                name: "Department");

            migrationBuilder.DropTable(
                name: "Organization");
        }
    }
}
