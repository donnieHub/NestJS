import { CustomScalar, Scalar } from '@nestjs/graphql';
import {GraphQLError, Kind, ValueNode} from 'graphql';

@Scalar('DateTime', () => Date)
export class DateTimeScalar implements CustomScalar<string, Date> {
    description = 'DateTime custom scalar type';

    parseValue(value: string): Date {
        console.log("parseValue", value);
        return new Date(value);
    }

    serialize(value: any): string {
        if (value instanceof Date) {
            return value.toISOString();
        }
        return value;
    }

    parseLiteral(ast: ValueNode): Date {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        else { throw new GraphQLError('DateTime: invalid literal'); }
    }
}