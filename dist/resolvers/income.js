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
exports.IncomeResolver = void 0;
const Income_1 = require("src/entities/Income");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
let IncomeOptions = class IncomeOptions {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], IncomeOptions.prototype, "amount", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], IncomeOptions.prototype, "category", void 0);
IncomeOptions = __decorate([
    type_graphql_1.InputType()
], IncomeOptions);
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
let IncomeResponse = class IncomeResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], IncomeResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Income_1.Income, { nullable: true }),
    __metadata("design:type", Income_1.Income)
], IncomeResponse.prototype, "income", void 0);
IncomeResponse = __decorate([
    type_graphql_1.ObjectType()
], IncomeResponse);
let IncomeResolver = class IncomeResolver {
    allIncomes() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Income_1.Income.find();
        });
    }
    findIncome(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Income_1.Income.findOne(id);
        });
    }
    createIncome(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let income;
            try {
                const result = yield typeorm_1.getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(Income_1.Income)
                    .values({
                    amount: options.amount,
                    category: options.category,
                })
                    .returning("*")
                    .execute();
                console.log("task result", result);
                income = result.raw[0];
            }
            catch (err) {
                if (err) {
                    return {
                        errors: [
                            {
                                field: "task",
                                message: "cannot create task",
                            },
                        ],
                    };
                }
            }
            return { income };
        });
    }
    updateIncome(id, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const income = yield Income_1.Income.findOne(id);
            if (!income) {
                return null;
            }
            if (typeof amount !== "undefined") {
                Income_1.Income.update({ id }, { amount });
            }
            return income;
        });
    }
    deleteIncome(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Income_1.Income.delete(id);
            return true;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Income_1.Income]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IncomeResolver.prototype, "allIncomes", null);
__decorate([
    type_graphql_1.Query(() => Income_1.Income, { nullable: true }),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IncomeResolver.prototype, "findIncome", null);
__decorate([
    type_graphql_1.Mutation(() => IncomeResponse),
    __param(0, type_graphql_1.Arg("options")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [IncomeOptions, Object]),
    __metadata("design:returntype", Promise)
], IncomeResolver.prototype, "createIncome", null);
__decorate([
    type_graphql_1.Mutation(() => Income_1.Income, { nullable: true }),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Arg("amount", () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], IncomeResolver.prototype, "updateIncome", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IncomeResolver.prototype, "deleteIncome", null);
IncomeResolver = __decorate([
    type_graphql_1.ObjectType()
], IncomeResolver);
exports.IncomeResolver = IncomeResolver;
//# sourceMappingURL=income.js.map