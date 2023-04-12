import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { CarModule } from './car/car.module';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { readFileSync } from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      //uses the schema.gql file in the root directory.
      typeDefs: readFileSync('schema.gql', 'utf8'),
      context: ({ req }) => ({ req }),
      plugins: [ApolloServerPluginInlineTrace() as any],
    }),
    CarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
