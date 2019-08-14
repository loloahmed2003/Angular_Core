using ExcelSystems_Task.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExcelSystems_Task.Services
{
    public interface IUser
    {
        Task<IList<User>> GetAllUsers();
        Task<User> GetUserById (string id);
        Task<User> GetUserByName(string name);

        Task<User> CreateUser (User user);
        Task<bool> DeleteUser (string id);
        Task<User> EditUser (User user);

    }
}
