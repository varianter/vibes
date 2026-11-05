using Api.Onboardings;
using Microsoft.Extensions.Options;

namespace Tests.Api.Tests;

public class EntraProvisioningTests
{
    private static MockEntraUserProvisioner CreateMock()
    {
        return new MockEntraUserProvisioner(Options.Create(new EntraProvisioningConfig { Domain = "variant.no" }));
    }

    [Fact]
    public async Task MockProvisioner_CreatesUserWithFirstAndLastName()
    {
        var result = await CreateMock().CreateUser(
            new EntraUserRequest("Kari Nordmann", "Oslo", null), CancellationToken.None);

        Assert.True(result.Succeeded);
        Assert.StartsWith("mock-", result.UserId);
        Assert.Equal("Opprettet som kari.nordmann@variant.no", result.Message);
        Assert.Equal("kari.nordmann@variant.no", result.UserPrincipalName);
    }

    [Fact]
    public async Task MockProvisioner_AddsNumberWhenNameIsTaken()
    {
        var result = await CreateMock().CreateUser(
            new EntraUserRequest("Finnes Nordmann", "Oslo", null), CancellationToken.None);

        Assert.Equal("Opprettet som finnes.nordmann2@variant.no", result.Message);
    }

    [Fact]
    public async Task MockProvisioner_SimulatesError()
    {
        var result = await CreateMock().CreateUser(
            new EntraUserRequest("Feil Nordmann", "Oslo", null), CancellationToken.None);

        Assert.False(result.Succeeded);
        Assert.Equal("Entra ID svarte med feil (500)", result.Message);
    }

    [Fact]
    public void CreatePassword_MeetsEntraComplexity()
    {
        var password = GraphEntraUserProvisioner.CreatePassword();

        Assert.Equal(24, password.Length);
        Assert.Contains(password, char.IsLower);
        Assert.Contains(password, char.IsUpper);
        Assert.Contains(password, char.IsDigit);
        Assert.Contains(password, c => !char.IsLetterOrDigit(c));
    }

    [Fact]
    public void CreatePassword_IsDifferentEachTime()
    {
        Assert.NotEqual(GraphEntraUserProvisioner.CreatePassword(), GraphEntraUserProvisioner.CreatePassword());
    }
}

public class UserPrincipalNamesTests
{
    [Theory]
    [InlineData("Kari Nordmann", "kari.nordmann")]
    [InlineData("Kari Anne Nordmann", "kari.nordmann")]
    [InlineData("  Kari   Nordmann  ", "kari.nordmann")]
    [InlineData("Jørgen Ærøy Åsheim", "jorgen.asheim")]
    [InlineData("Ærlig Øvrebø", "aerlig.ovrebo")]
    [InlineData("Anne-Marie Østby-Hansen", "anne-marie.ostby-hansen")]
    [InlineData("Éric O'Neil", "eric.oneil")]
    [InlineData("Madonna", "madonna")]
    [InlineData("", "")]
    public void LocalPart_IsFirstAndLastNameWithDot(string fullName, string expected)
    {
        Assert.Equal(expected, UserPrincipalNames.LocalPart(fullName));
    }

    [Fact]
    public void Candidates_StartWithPlainNameThenAddNumbers()
    {
        var candidates = UserPrincipalNames.Candidates("Kari Nordmann", "variant.no").ToList();

        Assert.Equal("kari.nordmann@variant.no", candidates[0]);
        Assert.Equal("kari.nordmann2@variant.no", candidates[1]);
        Assert.Equal("kari.nordmann9@variant.no", candidates[^1]);
        Assert.Equal(9, candidates.Count);
    }

    [Fact]
    public void Candidates_AreEmptyWithoutUsableName()
    {
        Assert.Empty(UserPrincipalNames.Candidates("!!!", "variant.no"));
    }
}
