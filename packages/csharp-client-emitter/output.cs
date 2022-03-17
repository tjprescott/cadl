using Microsoft.Cadl.ProviderHub;
using System.Security.Policy;

namespace Microsoft.Confluent.Service.Models
{
    public class UserDetails
    {
        [Length(50)]
        public string FirstName { get; set; }

        [Length(50)]
        public string LastName { get; set; }

        [Pattern("\w+\@\w+\.\w+")]
        public string EmailAddress { get; set; }
    }
}