import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Car } from './car.model';
import { CarInput } from './dto/car-input.dto';
import { BadRequestException } from '@nestjs/common';

const prisma = new PrismaClient();

@Injectable()
export class CarService {
  //gets all car objects in the database and map them to car model
  async getAllCars(): Promise<Car[]> {
    const cars = await prisma.car.findMany();
    return cars.map((car) => ({
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      color: car.color,
    }));
  }

  //gets all car objects in the database based on make of car
  async getCarsByMake(make: string): Promise<Car[]> {
    //if make is not in the query string then return no make requested.
    if (!make) {
      throw new BadRequestException('No make requested');
    }
    //find all cars where make matches
    const cars = await prisma.car.findMany({ where: { make } });
    //map cars to the model
    return cars.map((car) => ({
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      color: car.color,
    }));
  }

  //groups cars by make
  async groupCarsByMake(): Promise<{ make: string; items: Car[] }[]> {
    //first retreive all cars
    const cars = await this.getAllCars();
    const groupedCars = cars.reduce((acc, car) => {
      //find index of make in acc
      const makeIndex = acc.findIndex((group) => group.make === car.make);
      //if it exists push car
      if (makeIndex !== -1) {
        acc[makeIndex].items.push(car);
        //eslse make a new group and push to acc
      } else {
        acc.push({ make: car.make, items: [car] });
      }
      return acc;
    }, []);
    //return
    return groupedCars;
  }

  //adds a car to the database
  async addCar(carInput: CarInput): Promise<Car> {
    //creates car using the input information
    const createdCar = await prisma.car.create({ data: carInput });
    //destructure and return information
    const { id, make, model, year, color } = createdCar;
    return { id, make, model, year, color };
  }

  //accepts a list of cars and will add them to the database
  async addCars(carInputs: CarInput[]): Promise<Car[]> {
    //creates the cars in the database
    const createdCars = await prisma.car.createMany({ data: carInputs });
    const where = {
      OR: carInputs.map((input) => ({
        make: input.make,
        model: input.model,
        year: input.year,
      })),
    };
    //finds the cars and returns them
    //did this in steps rather than just returning in order to see the id right away
    //when it is returned right away it was returning -1
    //this way it will show the correct ID
    const cars = await prisma.car.findMany({ where });
    return cars.map((car) => ({
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      color: car.color,
    }));
  }
}
