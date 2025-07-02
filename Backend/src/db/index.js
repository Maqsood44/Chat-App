import mongoose from "mongoose"
import { DB_NAME } from "../contstents.js"

export const DBconnection = async () => {
    try {
      
    const db = await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
    console.log("Database has been connected")
  } catch (error) {
    console.log("Error in db file", error.message)
  }
}



