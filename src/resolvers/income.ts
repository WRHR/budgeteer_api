import { Income } from "src/entities/Income";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
} from "type-graphql";
import { MyContext } from "../types";

@InputType()
class IncomeOptions {
  @Field()
  amount!: number;

  @Field()
  category!: string;

  @Field()
  occurance: string;
}

@ObjectType()
export class IncomeResolver {
  @Query(() => [Income])
  async allIncomes(): Promise<Income[]> {
    return await Income.find();
  }

  @Query(() => Income, { nullable: true })
  async findIncome(@Arg("id") id: number): Promise<Income | undefined> {
    return await Income.findOne(id);
  }

  @Mutation(() => Income)
  async createIncome(
    @Arg("options") options: IncomeOptions,
    @Ctx() { req }: MyContext
  ): Promise<Income> {
    return Income.create({
      ...options,
      userId: req.session.userId,
    }).save();
  }

  @Mutation(() => Income, { nullable: true })
  async updateIncome(
    @Arg("id") id: number,
    @Arg("amount") amount: number
  ): Promise<Income | null> {
    const income = await Income.findOne(id);
    if (!income) {
      return null;
    }
    if (typeof amount !== "undefined") {
      Income.update({ id }, { amount });
    }
    return income;
  }

  @Mutation(() => Boolean)
  async deleteIncome(@Arg("id") id: number): Promise<boolean> {
    await Income.delete(id);
    return true;
  }
}
