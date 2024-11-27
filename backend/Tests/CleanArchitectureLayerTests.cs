using ArchUnitNET.Domain;
using ArchUnitNET.Fluent;
using ArchUnitNET.Loader;
using ArchUnitNET.NUnit;
using static ArchUnitNET.Fluent.ArchRuleDefinition;
using Assembly = System.Reflection.Assembly;

namespace Tests;

public class CleanArchitectureLayerTests
{
    // TIP: load your architecture once at the start to maximize performance of your tests
    private static readonly Architecture Architecture = new ArchLoader().LoadAssemblies(
        Assembly.Load("Core"),
        Assembly.Load("Infrastructure"),
        Assembly.Load("Api")
    ).Build();

    private readonly IObjectProvider<IType> ApiLayer =
        Types().That().ResideInNamespace("Api").As("Api Layer");

    private readonly IObjectProvider<IType> CoreLayer =
        Types().That().ResideInAssembly("ApplicationCore").As("Application Core Layer");

    private readonly IObjectProvider<IType> DatabaseLayer =
        Types().That().ResideInNamespace("Infrastructure").As("Infrastructure Layer");

    [Test]
    public void CoreLayerShouldNotAccessApiLayer()
    {
        IArchRule applicationCoreLayerShouldNotAccessApiLayer = Types().That().Are(CoreLayer).Should()
            .NotDependOnAny(ApiLayer).Because("The ApplicationCore project should not depend on the Api project.");
        applicationCoreLayerShouldNotAccessApiLayer.Check(Architecture);
    }

    [Test]
    public void CoreLayerShouldNotAccessDatabaseLayer()
    {
        IArchRule applicationCoreLayerShouldNotAccessApiLayer = Types().That().Are(CoreLayer).Should()
            .NotDependOnAny(DatabaseLayer).Because("The ApplicationCore project should not depend on the Api project.");
        applicationCoreLayerShouldNotAccessApiLayer.Check(Architecture);
    }

    [Test]
    public void DatabaseLayerShouldNotAccessApiLayer()
    {
        IArchRule infrastructureLayerShouldNotAccessApiLayer = Types().That().Are(DatabaseLayer).Should()
            .NotDependOnAny(ApiLayer).Because("The Infrastructure project should not depend on the Api project.");
        infrastructureLayerShouldNotAccessApiLayer.Check(Architecture);
    }
}