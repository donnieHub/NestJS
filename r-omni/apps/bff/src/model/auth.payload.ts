import {ObjectType, Field} from '@nestjs/graphql';
import {UserModel} from "./user.model";

@ObjectType()
export class AuthPayload {

    @Field()
    token: string;

    @Field(() => UserModel)
    user?: UserModel;
}
