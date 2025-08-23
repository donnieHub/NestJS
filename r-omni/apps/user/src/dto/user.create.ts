import {IsEmail, IsIn, IsNotEmpty, IsString, MinLength} from "class-validator";

export class UserCreate {

    @IsEmail({}, { message: 'Invalid email format!' })
    @IsNotEmpty({ message: 'Email cannot be empty!' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password cannot be empty!' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'Role cannot be empty!' })
    @IsIn(['user', 'admin', 'manager'], { message: 'role must be one of: user, admin, manager' })
    role: string;
}