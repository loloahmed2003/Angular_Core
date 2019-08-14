using ExcelSystems_Task.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExcelSystems_Task.MyContext
{
    public class UserDB : IdentityDbContext
    {
        public UserDB(DbContextOptions<UserDB> op) : base(op)
        {

        }

        public DbSet<User> ApplicationUsers { get; set; }
    }
}
