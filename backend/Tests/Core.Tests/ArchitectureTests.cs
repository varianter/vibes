using ArchUnitNET.Domain;
using ArchUnitNET.Loader;
using ArchUnitNET.xUnit;
using static ArchUnitNET.Fluent.ArchRuleDefinition;
using Assembly = System.Reflection.Assembly;

namespace Tests.Core.Tests;

public class ArchitectureTests
{
    private static readonly Architecture Architecture = new ArchLoader().LoadAssemblies(
        Assembly.Load("Core"),
        Assembly.Load("Infrastructure"),
        Assembly.Load("Api")
    ).Build();

    private readonly IObjectProvider<IType> _apiLayer =
        Types()
            .That()
            .ResideInNamespace("Api")
            .As("Api Layer");

    private readonly IObjectProvider<IType> _coreLayer =
        Types()
            .That()
            .ResideInAssembly("Core")
            .As("Core Layer");

    private readonly IObjectProvider<IType> _databaseLayer =
        Types()
            .That()
            .ResideInNamespace("Infrastructure")
            .As("Infrastructure Layer");

    [Fact]
    public void CoreLayer_Should_Not_Access_ApiLayer()
    {
        Types()
            .That()
            .Are(_coreLayer)
            .Should()
            .NotDependOnAny(_apiLayer)
            .Because("The Core project should not depend on the Api project.")
            .WithoutRequiringPositiveResults()
            .Check(Architecture);
    }

    [Fact]
    public void CoreLayer_Should_Not_Access_DatabaseLayer()
    {
        Types()
            .That()
            .Are(_coreLayer)
            .Should()
            .NotDependOnAny(_databaseLayer)
            .Because("The Core project should not depend on the Api project.")
            .WithoutRequiringPositiveResults()
            .Check(Architecture);
    }

    [Fact]
    public void DatabaseLayer_Should_Not_Access_ApiLayer()
    {
        Types()
            .That()
            .Are(_databaseLayer)
            .Should()
            .NotDependOnAny(_apiLayer)
            .Because("The Infrastructure project should not depend on the Api project.")
            .WithoutRequiringPositiveResults()
            .Check(Architecture);
    }
}