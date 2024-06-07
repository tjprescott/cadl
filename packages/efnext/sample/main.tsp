import "@typespec/http";
using TypeSpec.Http;
@service
namespace DemoService {

  @route("/people")
  namespace People {
    model Person {
      firstName: string;
      lastName: string;
      pets: Pets.Pet[];
    }

    op listPeople(sortBy?: string): Person[];
  }  


  @route("/pets")
  namespace Pets {
    model Pet {
      name: string;
      owner?: People.Person;
    }

    op listPets(): Pet[];
  }
}