import {Field, InputType} from '@nestjs/graphql';
import {IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";

@InputType()
export class RegisterInput {

    @IsEmail({}, { message: 'Invalid email format!' })
    @IsNotEmpty({ message: 'Email cannot be empty!' })
    @Field()
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password cannot be empty!' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @Field()
    password: string;
}
