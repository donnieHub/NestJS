import {IsEmail, IsIn, IsNotEmpty, IsString} from "class-validator";

export class UserCreate {

    @IsEmail({}, { message: 'Invalid email format!' })
    @IsNotEmpty({ message: 'Email cannot be empty!' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'PasswordHash cannot be empty!' })
    passwordHash: string;

    @IsString()
    @IsNotEmpty({ message: 'Role cannot be empty!' })
    @IsIn(['user', 'admin', 'manager'], { message: 'role must be one of: user, admin, manager' })
    role: string;
}