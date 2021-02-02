"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseResolver = void 0;
const Expense_1 = require("src/entities/Expense");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
let ExpenseOptions = class ExpenseOptions {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], ExpenseOptions.prototype, "amount", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ExpenseOptions.prototype, "category", void 0);
ExpenseOptions = __decorate([
    type_graphql_1.InputType()
], ExpenseOptions);
let FieldError = class FieldError {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    type_graphql_1.ObjectType()
], FieldError);
let ExpenseResponse = class ExpenseResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], ExpenseResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Expense_1.Expense, { nullable: true }),
    __metadata("design:type", Expense_1.Expense)
], ExpenseResponse.prototype, "expense", void 0);
ExpenseResponse = __decorate([
    type_graphql_1.ObjectType()
], ExpenseResponse);
let ExpenseResolver = class ExpenseResolver {
    allExpenses() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Expense_1.Expense.find();
        });
    }
    findExpense(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Expense_1.Expense.findOne(id);
        });
    }
    createExpense(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let expense;
            try {
                const result = yield typeorm_1.getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(Expense_1.Expense)
                    .values({
                    amount: options.amount,
                    category: options.category,
                    userId: req.session.userId,
                })
                    .returning("*")
                    .execute();
                console.log("task result", result);
                expense = result.raw[0];
            }
            catch (err) {
                if (err) {
                    return {
                        errors: [
                            {
                                field: "expense",
                                message: "cannot create task",
                            },
                        ],
                    };
                }
            }
            return { expense };
        });
    }
    updateExpense(id, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const expense = yield Expense_1.Expense.findOne(id);
            if (!expense) {
                return null;
            }
            if (typeof amount !== "undefined") {
                Expense_1.Expense.update({ id }, { amount });
            }
            return expense;
        });
    }
    deleteExpesee(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Expense_1.Expense.delete(id);
            return true;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Expense_1.Expense]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExpenseResolver.prototype, "allExpenses", null);
__decorate([
    type_graphql_1.Query(() => Expense_1.Expense, { nullable: true }),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExpenseResolver.prototype, "findExpense", null);
__decorate([
    type_graphql_1.Mutation(() => ExpenseResponse),
    __param(0, type_graphql_1.Arg("options")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExpenseOptions, Object]),
    __metadata("design:returntype", Promise)
], ExpenseResolver.prototype, "createExpense", null);
__decorate([
    type_graphql_1.Mutation(() => Expense_1.Expense, { nullable: true }),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Arg("amount", () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ExpenseResolver.prototype, "updateExpense", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExpenseResolver.prototype, "deleteExpesee", null);
ExpenseResolver = __decorate([
    type_graphql_1.ObjectType()
], ExpenseResolver);
exports.ExpenseResolver = ExpenseResolver;
//# sourceMappingURL=expense.js.map