using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Forecast_UseMonthDataTypeForMonthProperty : Migration
    {
        private const string TableName = "Forecasts";
        private const string PrimaryKeyName = "PK_Forecasts";
        private const string ColumnName = "Month";
        private const string ColumnNameTemp = "MonthTemporary";

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            DropPrimaryKey(migrationBuilder);
            AddTemporaryIntColumn(migrationBuilder);
            ReplaceColumn(migrationBuilder);
            AddPrimaryKey(migrationBuilder);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            DropPrimaryKey(migrationBuilder);
            AddTemporaryDateTimeColumn(migrationBuilder);
            ReplaceColumn(migrationBuilder);
            AddPrimaryKey(migrationBuilder);
        }

        private static void DropPrimaryKey(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: PrimaryKeyName,
                table: TableName);
        }

        private static void AddTemporaryIntColumn(MigrationBuilder migrationBuilder)
        {
            // Add nullable column
            migrationBuilder.AddColumn<int>(
                name: ColumnNameTemp,
                table: TableName,
                type: "int",
                nullable: true);

            // Populate column with values
            migrationBuilder.Sql($"UPDATE {TableName} SET {ColumnNameTemp} = 100 * DATEPART(yyyy, {ColumnName}) + DATEPART(MM, {ColumnName})");

            // Make column not nullable
            migrationBuilder.AlterColumn<int>(
                name: ColumnNameTemp,
                table: TableName,
                nullable: false);
        }

        private static void AddTemporaryDateTimeColumn(MigrationBuilder migrationBuilder)
        {
            // Add nullable column
            migrationBuilder.AddColumn<DateTime>(
                name: ColumnNameTemp,
                table: TableName,
                type: "datetime2",
                nullable: true);

            // Populate column with values
            migrationBuilder.Sql($"UPDATE {TableName} SET {ColumnNameTemp} = DATEFROMPARTS({ColumnName} / 100, {ColumnName} % 100, 1)");

            // Make column not nullable
            migrationBuilder.AlterColumn<DateTime>(
                name: ColumnNameTemp,
                table: TableName,
                nullable: false);
        }

        private static void ReplaceColumn(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: ColumnName,
                table: TableName);

            migrationBuilder.RenameColumn(
                name: ColumnNameTemp,
                table: TableName,
                newName: ColumnName);
        }

        private static void AddPrimaryKey(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddPrimaryKey(
                name: PrimaryKeyName,
                table: TableName,
                columns: ["ConsultantId", "Month"]);
        }
    }
}
