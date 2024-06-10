using Core.DomainModels;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Database.ValueConverters;

public class MonthConverter : ValueConverter<Month, int>
{
    public MonthConverter() : base(
        month => month.ToSortableInt(),
        monthAsInt => new Month(monthAsInt))
    {
    }
}