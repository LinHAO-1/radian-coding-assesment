import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Car {
  @Field(() => Int)
  id: number;

  @Field()
  make: string;

  @Field()
  model: string;

  @Field()
  year: number;

  @Field()
  color: string;
}
