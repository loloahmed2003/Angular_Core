using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ExcelSystems_Task.Models
{
    public class User : IdentityUser
    {
        //[Key]
        //public int ID { get; set; }

        //[Required]
        //[StringLength(20, MinimumLength = 3)]
        public string Name { get; set; }

        [DefaultValue(true)]
        public bool IsActive { get; set; }

    }
}
