namespace Api.Helpers;

public static class NumericsHelper
{
	private const double Epsilon = 0.00001;

	public static bool DoubleEquals(double a, double b)
	{
		return Math.Abs(a - b) < Epsilon;
	}
}
