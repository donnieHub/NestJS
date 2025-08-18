import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
    @Field()
    email: string;

    @Field()
    password: string; // пароль передаём в GraphQL, но на бэке хэшируем

    @Field()
    role: string;
}