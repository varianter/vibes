using Core.DomainModels;
using Core.IRepositories;
using Database.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Database.Repositories;

public class EngagementDbRepository : IEngagementRepository
{
    private readonly ApplicationContext _context;

    public EngagementDbRepository(ApplicationContext context)
    {
        _context = context;
    }

    public Engagement? GetEngagementById(int id)
    {
        // Her trenger jeg en bedre måte å deale med relasjoner: Ideelt kanskje et customer-repository på et vis? 
        // How to relasjoner i repository?
        return _context.Project.Include(p => p.Customer).SingleOrDefault(p => p.Id == id);
    }
}