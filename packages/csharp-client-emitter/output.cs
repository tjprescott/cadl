public class UserDetails
{
    [Length(50)]
    public string FirstName { get; set; }
    [Length(50)]
    public string LastName { get; set; }
    [Pattern("\w+\@\w+\.\w+")]
    public string EmailAddress { get; set; }
}