using AuthService.Enums;
using System.ComponentModel.DataAnnotations;

namespace AuthService.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public UserRole UserRole { get; set; }
        public string PhotoUrl { get; set; } = "https://res.cloudinary.com/dskyn1svm/image/upload/v1779900412/Screenshot_663_-modified_zxou8a.png";

        public User() { }
    }
}
