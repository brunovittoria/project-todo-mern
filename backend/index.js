const dotenv = require("dotenv")
const connectToDatabase = require("./src/database/connect")

dotenv.config() //DEVE SER CHAMADO PRIMEIRO SEMPRE!

connectToDatabase()


const app = require('./modules/express')

