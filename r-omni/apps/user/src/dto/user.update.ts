import {IsEmail, IsIn, IsOptional, IsString, IsUUID} from "class-validator";
import {Field, InputType} from "@nestjs/graphql";
import {UserRole} from "../entities/user.role";

@InputType()
export class UserUpdate {

    @IsUUID()
    @Field()
    id: string;

    @IsEmail({}, { message: 'Invalid email format!' })
    @IsOptional()
    @Field({ nullable: true })
    email?: string;

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    passwordHash?: string;

    @IsString()
    @IsOptional()
    @IsIn(['user', 'admin', 'manager'], { message: 'role must be one of: user, admin, manager' })
    @Field({ nullable: true })
    role?: UserRole;
}