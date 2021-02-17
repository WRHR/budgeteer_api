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
import { getConnection } from "typeorm";
import { MyContext } from "../types";

@InputType()
class IncomeOptions {
  @Field()
  amount!: number;

  @Field()
  category!: string;

  @Field()
  occurance:string
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class IncomeResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Income, { nullable: true })
  income?: Income;
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

  // @Mutation(() => IncomeResponse)
  // async createIncome(
  //   @Arg("options") options: IncomeOptions,
  //   @Ctx() { req }: MyContext
  // ): Promise<IncomeResponse> {
  //   let income;

  //   try {
  //     const result = await getConnection()
  //       .createQueryBuilder()
  //       .insert()
  //       .into(Income)
  //       .values({
  //         amount: options.amount,
  //         category: options.category,
  //         userId: req.session.userId,
  //       })
  //       .returning("*")
  //       .execute();
  //     income = result.raw[0];
  //   } catch (err) {
  //     if (err) {
  //       return {
  //         errors: [
  //           {
  //             field: "income",
  //             message: "cannot create income",
  //           },
  //         ],
  //       };
  //     }
  //   }
  //   return { income };
  // }
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
    @Arg("amount", () => String, { nullable: true }) amount: number
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
