import {User} from "./entities/users.entity";
import {EntityRepository} from "@mikro-orm/postgresql";

export class UserRepository extends EntityRepository<User> {

}