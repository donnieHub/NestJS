import {IsEmail, IsInt, IsNotEmpty, IsString, Length} from "class-validator";

export class UserCreate {
    @IsInt()
    id: number;
    @IsString()
    @Length(3, 20, {
        message: 'Name must be between 3 and 20 characters!',
    })
    @IsNotEmpty({ message: 'Name cannot be empty!' })
    name: string;
    @IsEmail({}, { message: 'Invalid email format!' })
    email: string;
}