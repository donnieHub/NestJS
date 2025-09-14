import {ObjectType, Field, ID} from '@nestjs/graphql';
import {UserRole} from "../../../user/src/entities/user.role";

@ObjectType()
export class UserModel {
    @Field(() => ID)
    id: string;

    @Field()
    email: string;

    @Field(() => UserRole)
    role: UserRole;

    @Field(() => Date, { nullable: true })
    created_at?: Date;
}
