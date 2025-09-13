import {IsEmail, IsIn, IsNotEmpty, IsString, MinLength} from "class-validator";
import {Field, InputType} from "@nestjs/graphql";
import {UserRole} from "../entities/user.role";

@InputType()
export class UserCreate {

    @IsEmail({}, { message: 'Invalid email format!' })
    @IsNotEmpty({ message: 'Email cannot be empty!' })
    @Field()
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password cannot be empty!' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @Field()
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'Role cannot be empty!' })
    @IsIn(['user', 'admin', 'manager'], { message: 'role must be one of: user, admin, manager' })
    @Field()
    role: UserRole;
}