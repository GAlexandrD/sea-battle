import { Sequelize } from "sequelize"

export const sequelize = new Sequelize('postgres://postgres:postgres@database:5432/sea-battle')