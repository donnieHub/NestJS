import {IsEmail, IsIn, IsOptional, IsString, IsUUID} from "class-validator";

export class UserUpdate {

    @IsUUID()
    id: string;

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