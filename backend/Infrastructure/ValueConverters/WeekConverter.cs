using Core.DomainModels;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.ValueConverters;

public class WeekConverter : ValueConverter<Week, int>
{
    public WeekConverter() : base(
        week => week.ToSortableInt(),
        weekAsInt => new Week(weekAsInt))
    {
    }
}