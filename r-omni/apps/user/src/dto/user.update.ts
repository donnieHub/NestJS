import {IsEmail, IsIn, IsOptional, IsString} from "class-validator";

export class UserUpdate {

    @IsEmail({}, { message: 'Invalid email format!' })
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    passwordHash?: string;

    @IsString()
    @IsOptional()
    @IsIn(['user', 'admin', 'manager'], { message: 'role must be one of: user, admin, manager' })
    role?: string;
}