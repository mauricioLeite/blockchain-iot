import { JestConfigWithTsJest, pathsToModuleNameMapper } from "ts-jest"
import { compilerOptions } from "./tsconfig.json";

/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig: JestConfigWithTsJest = {
    preset: "ts-jest",
    testEnvironment: "node",
	testMatch: ["**/?(*.)+(spec|test).js"],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: `${__dirname}/src/`})
}

export default jestConfig;