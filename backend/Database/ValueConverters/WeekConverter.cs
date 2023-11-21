using Core.DomainModels;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Database.ValueConverters;

public class WeekConverter : ValueConverter<Week, int>
{
    public WeekConverter() : base(
        week => week.ToSortableInt(),
        weekAsInt => new Week(weekAsInt))
    {
    }
}