using Core.DomainModels;
using Core.IRepositories;
using Database.DatabaseContext;

namespace Database.Repositories;

public class CustomerRepository : ICustomerRepository
{
    private readonly ApplicationContext _context;

    public CustomerRepository(ApplicationContext context)
    {
        _context = context;
    }

    public Customer? GetCustomerById(int id)
    {
        return _context.Customer.Find(id);
    }
}