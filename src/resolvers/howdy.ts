import { Resolver, Query } from 'type-graphql'

@Resolver()
export class HowdyResolver {
  @Query()
  hello(){
    return "howdy"
  }
}