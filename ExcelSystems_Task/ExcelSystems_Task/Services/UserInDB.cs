using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExcelSystems_Task.Models;
using ExcelSystems_Task.MyContext;
using Microsoft.EntityFrameworkCore;

namespace ExcelSystems_Task.Services
{
    public class UserInDB : IUser
    {
        private UserDB _db;

        public UserInDB(UserDB db)
        {
            _db = db;
        }

        public async Task<User> CreateUser(User user)
        {
            await _db.AddAsync(user);
            await _db.SaveChangesAsync();

            return user;
        }

        public async Task<bool> DeleteUser(string id)
        {
            User user = await _db.ApplicationUsers.FindAsync(id);
            if (user != null)
            {
                user.IsActive = false;
                await _db.SaveChangesAsync();
            }

            return true;
        }

        public async Task<User> EditUser(User user)
        {
            User old_user = await _db.ApplicationUsers.SingleAsync(u => u.Id == user.Id);
            old_user.Name = user.Name;
            await _db.SaveChangesAsync();

            return user;
        }


        public async Task<IList<User>> GetAllUsers()
        {
            return await _db.ApplicationUsers.ToListAsync();
        }

        public async Task<User> GetUserById(string id)
        {
            return await _db.ApplicationUsers.SingleAsync(a=> a.Id == id);
        }

        public async Task<User> GetUserByName(string name)
        {
            return await _db.ApplicationUsers.SingleAsync(a => a.Name == name);

        }
    }
}
