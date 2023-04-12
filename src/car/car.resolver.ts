import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CarService } from './car.service';
import { Car } from './car.model';
import { CarInput } from './dto/car-input.dto';
import { BadRequestException } from '@nestjs/common';

@Resolver(() => Car)
export class CarResolver {
  constructor(private readonly carService: CarService) {}

  //defined query that will run carService to get all cars
  @Query(() => [Car])
  async getAllCars(): Promise<Car[]> {
    return this.carService.getAllCars();
  }

  //defined query that will run carService to get all cars by make
  @Query(() => [Car])
  async getCarsByMake(
    @Args('make', { nullable: false }) make: string,
  ): Promise<Car[]> {
    if (!make) {
      throw new BadRequestException('No make requested');
    }
    return this.carService.getCarsByMake(make);
  }

  @Query(() => [{ make: String, items: [Car] }])
  async groupCarsByMake(): Promise<{ make: string; items: Car[] }[]> {
    return this.carService.groupCarsByMake();
  }

  //defined mutation that will run append a new car to the list
  @Mutation(() => Car)
  async addCar(@Args('carInput') carInput: CarInput): Promise<Car> {
    return this.carService.addCar(carInput);
  }

  //defined query that will append a list of cars to the database
  @Mutation(() => [Car])
  async addCars(
    @Args('carInputs', { type: () => [CarInput] }) carInputs: CarInput[],
  ): Promise<Car[]> {
    return this.carService.addCars(carInputs);
  }
}
