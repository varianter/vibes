using System.Net.Mail;
using Api.Routes;
using Core.DomainModels;

namespace Api.Validators;

public static class ConsultantValidators
{
    public static bool IsValidEmail(string email)
    {
        var valid = true;

        try
        {
            var mailAddress = new MailAddress(email);
        }
        catch
        {
            valid = false;
        }

        return valid;
    }

    public static IDictionary<string, string []> ValidateUniqueness(List<Consultant> consultantList,
        ConsultantApi.ConsultantWriteModel body)
    {
        var results = new Dictionary<string, string[]>();

        var isNameUnique = consultantList.All(item => item.Name != body.Name);
        var isEmailUnique = consultantList.All(item => item.Email != body.Email);
        var isEmailValid = IsValidEmail(body.Email);

        if (!isNameUnique)
            results.Add("name", new[] { "already exist" });
        if (!isEmailUnique)
            results.Add("email", new[] { "already exist" });
        if (!isEmailValid)
            results.Add("email", new[] { "has a invalid email format" });

        return results;
    }
}