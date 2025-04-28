using Core.Months;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.ValueConverters;

public class MonthConverter() : ValueConverter<Month, DateOnly>(
	month => month.FirstDay,
	monthAsDateOnly => new Month(monthAsDateOnly));
