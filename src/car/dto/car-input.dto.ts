import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CarInput {
  @Field()
  make: string;

  @Field()
  model: string;

  @Field()
  year: number;

  @Field()
  color: string;
}
