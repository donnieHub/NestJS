import {UserCreate} from "./user.create";

export class UserUpdate implements Partial<Omit<UserCreate, 'id'>> {}