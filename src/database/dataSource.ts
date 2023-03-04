import { DataSource } from "typeorm"
import ormConfig  from "@database/ormconfig"

// ! ORGANIZE DS INSTANCE ON UTILS FOLDER
export const dsInstance = new DataSource(ormConfig)