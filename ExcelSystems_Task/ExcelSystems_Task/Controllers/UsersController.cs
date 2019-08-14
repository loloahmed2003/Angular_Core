using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ExcelSystems_Task.Services;
using ExcelSystems_Task.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;

namespace ExcelSystems_Task.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowOrigin")]

    public class UsersController : Controller
    {
        private readonly AppSettings _appSettings;

        private UserManager<User> _userManager;
        private SignInManager<User> _singInManager;

        IUser _context;
        readonly ILogger<UsersController> _log;

        public UsersController(UserManager<User> userManager, SignInManager<User> signInManager, IUser user, ILogger<UsersController> log, IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;

            _userManager = userManager;
            _singInManager = signInManager;

            _context = user;
            _log = log;
        }

        #region Authentication

        [HttpPost]
        [Route("Register")]
        //POST : /api/Users/Register
        public async Task<Object> PostUser(NewUserModel model)
        {
            var user = new User()
            {
                UserName = model.UserName,
                Email = model.Email,
                Name = model.Name,
                IsActive = true
            };

            try
            {
                var result = await _userManager.CreateAsync(user, model.Password);
                return Ok(result);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        [HttpPost]
        [Route("Login")]
        //POST : /api/Users/Login
        public async Task<IActionResult> Login(LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("UserID",user.Id.ToString())
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);
                return Ok(new { token });
            }
            else
                return BadRequest(new { message = "Username or password is incorrect." });
        }

        #endregion



        #region Authorization_CRUD
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            _log.LogInformation("GetAllUserRequest");
            return Ok(await _context.GetAllUsers());
        }


        [HttpGet("GetUser/{id}")]
        [Authorize]
        public async Task<IActionResult> GetByID([FromRoute]string id)
        {

            if (!ModelState.IsValid)
            {
                _log.LogInformation("GetUserByIDBadRequest");

                return BadRequest(ModelState);
            }

            var user = await _context.GetUserById(id);

            if (user == null)
            {
                _log.LogInformation("GetUserByIDNotFound");

                return NotFound();
            }

            return Ok(user);
        }

        [Route("GetUser/{name:alpha}")]
        [HttpGet]
        public async Task<IActionResult> GetByName([FromRoute] string name)
        {
            if (!ModelState.IsValid)
            {
                _log.LogInformation("GetUserByNameBadRequest");

                return BadRequest(ModelState);
            }

            var user = await _context.GetUserByName(name);

            if (user == null)
            {
                _log.LogInformation("GetUserByNameNotFound");

                return NotFound();
            }

            return Ok(user);
        }

        [HttpPost("Create")]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] User user)
        {

            try
            {
                await _context.CreateUser(user);
            }
            catch (Exception e)
            {
                if (!ModelState.IsValid)
                {
                    _log.LogInformation(e, " CreateUserBadRequest ");

                    return BadRequest(ModelState);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetByID", new { id = user.Id }, user);
        }


        [HttpPut("update/{id}")]
        [Authorize]
        public async Task<IActionResult> Update([FromBody] User user, [FromRoute] string id)
        {

            try
            {
                await _context.EditUser(user);
            }
            catch (Exception e)
            {
                if (!ModelState.IsValid)
                {
                    _log.LogInformation(e, " UpdateUserBadRequest ");

                    return BadRequest(ModelState);
                }

                if (id != user.Id)
                {
                    _log.LogInformation(e, " UpdateUserBadRequest ");

                    return BadRequest();
                }



                if (user == null)
                {
                    _log.LogInformation(e, " NullNotFound ");

                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        [HttpPut("delete/{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                await _context.DeleteUser(id);
            }



            catch (Exception e)
            {
                if (!ModelState.IsValid)
                {
                    _log.LogInformation(e, " deleteUserBadRequest ");

                    return BadRequest(ModelState);
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        #endregion

    }
}
