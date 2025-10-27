import { IsDate, IsOptional, IsUUID } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class FindAvailableRoomsInput {
    @IsDate({ message: 'startDate must be a valid Date' })
    @Field(() => Date)
    startDate: Date;

    @IsDate({ message: 'endDate must be a valid Date' })
    @Field(() => Date)
    endDate: Date;

    @IsUUID()
    @IsOptional()
    @Field({ nullable: true })
    buildingId?: string;
}