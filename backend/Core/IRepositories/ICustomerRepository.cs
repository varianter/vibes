using Core.DomainModels;

namespace Core.IRepositories;

public interface ICustomerRepository
{
    public Customer? GetCustomerById(int id);
}