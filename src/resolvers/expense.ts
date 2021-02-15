import { Expense } from "src/entities/Expense";
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
class ExpenseOptions {
  @Field()
  amount!: number;

  @Field()
  category!: string;

  @Field()
  occurance: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class ExpenseResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Expense, { nullable: true })
  expense?: Expense;
}

@ObjectType()
export class ExpenseResolver {
  @Query(() => [Expense])
  async allExpenses(): Promise<Expense[]> {
    return await Expense.find();
  }

  @Query(() => Expense, { nullable: true })
  async findExpense(@Arg("id") id: number): Promise<Expense | undefined> {
    return await Expense.findOne(id);
  }

  @Mutation(() => ExpenseResponse)
  async createExpense(
    @Arg("options") options: ExpenseOptions,
    @Ctx() { req }: MyContext
  ): Promise<ExpenseResponse> {
    let expense;

    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Expense)
        .values({
          amount: options.amount,
          category: options.category,
          userId: req.session.userId,
        })
        .returning("*")
        .execute();
      expense = result.raw[0];
    } catch (err) {
      if (err) {
        return {
          errors: [
            {
              field: "expense",
              message: "cannot create expense",
            },
          ],
        };
      }
    }
    return { expense };
  }

  @Mutation(() => Expense, { nullable: true })
  async updateExpense(
    @Arg("id") id: number,
    @Arg("amount", () => String, { nullable: true }) amount: number
  ): Promise<Expense | null> {
    const expense = await Expense.findOne(id);
    if (!expense) {
      return null;
    }
    if (typeof amount !== "undefined") {
      Expense.update({ id }, { amount });
    }
    return expense;
  }

  @Mutation(() => Boolean)
  async deleteExpesee(@Arg("id") id: number): Promise<boolean> {
    await Expense.delete(id);
    return true;
  }
}
