using Core.Months;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.ValueConverters;

public class MonthConverter() : ValueConverter<Month, int>(
	month => ToSortableInt(month),
	monthAsInt => FromSortableInt(monthAsInt))
{
	/// <summary>
	/// Converts a Month object to an int with six digits: YYYYMM
	/// </summary>
	private static int ToSortableInt(Month month) => month.Year * 100 + month.MonthNumber;

	/// <summary>
	/// Converts an int of six digits (YYYYMM) to a Month object
	/// </summary>
	private static Month FromSortableInt(int monthAsInt)
	{
		var year = monthAsInt / 100;
		var monthIndex = monthAsInt % 100;

		return new Month(year, monthIndex);
	}
}
