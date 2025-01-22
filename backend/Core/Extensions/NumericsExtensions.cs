namespace Core.Extensions;

public static class NumericsExtensions
{
	private const double Epsilon = 0.00001;

	/// <summary>
	/// Returns true if a is equal to b (with the given precision); otherwise, false
	/// </summary>
	public static bool IsEqualTo(this double a, double b, double precision = Epsilon)
	{
		return Math.Abs(a - b) < precision;
	}
}
