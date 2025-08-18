import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
    @Field(() => ID)
    id: string;

    @Field()
    email: string;

    @Field()
    role: string;

    @Field(() => Date)
    created_at: Date;
}
