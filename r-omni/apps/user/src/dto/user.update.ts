import {IsEmail, IsNotEmpty, IsOptional, IsString, Length} from "class-validator";

export class UserUpdate {

    @IsString()
    @IsNotEmpty({ message: 'Name cannot be empty!' })
    @Length(3, 20, {
        message: 'Name must be between 3 and 20 characters!',
    })
    @IsOptional()
    name?: string;

    @IsEmail({}, { message: 'Invalid email format!' })
    @IsOptional()
    email?: string;
}