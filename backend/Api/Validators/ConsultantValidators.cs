using System.Net.Mail;
using Api.Routes;
using Core.DomainModels;

namespace Api.Validators;

public static class ConsultantValidators
{
    public static bool IsValidEmail(string email)
    {
        return MailAddress.TryCreate(email, out _);
    }

    public static IDictionary<string, string []> ValidateUniqueness(List<Consultant> consultantList,
        ConsultantApi.ConsultantWriteModel body)
    {
        var results = new Dictionary<string, string[]>();

        var nameExits = consultantList.Any(item => item.Name == body.Name);
        var emailExists = consultantList.Any(item => item.Email == body.Email);
        var validEmail = IsValidEmail(body.Email);
        if (nameExits)
            results.Add("name", new[] { "already exist" });
        if (emailExists)
            results.Add("email", new[] { "already exist" });
        if (!validEmail)
            results.Add("email", new[] { "has a invalid email format" });

        return results;
    }
}