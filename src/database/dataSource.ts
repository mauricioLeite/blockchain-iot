import { DataSource } from "typeorm"
import ormConfig from "./ormconfig"

// ! ORGANIZE DS INSTANCE ON UTILS FOLDER
export const dsInstance = new DataSource(ormConfig)