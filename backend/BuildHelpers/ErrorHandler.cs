namespace backend.BuildHelpers;

public abstract class ErrorHandler
{
    public static void ThrowRequirementsException(string customErrorMessage)
    {
        var errorMessage =
            $"{customErrorMessage}. Environment: {Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}";
        Console.WriteLine(errorMessage);
        throw new Exception(errorMessage);
    }
}