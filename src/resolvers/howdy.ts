import { Resolver, Query } from 'type-graphql'

@Resolver()
export class HowdyResolver {
  @Query(()=>String)
  hello(){
    return "howdy"
  }
}