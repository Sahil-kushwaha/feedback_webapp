import mongoose from "mongoose";
import { databaseName } from "@/constants";

type ConnectionObject = {
    isConnected?: number
}

const connectionState: ConnectionObject={}
async function connectDB():Promise<void>{
      if(connectionState.isConnected){
         console.log('Already connected to database')
         return
      } 

     try {
         const db = await mongoose.connect(`${process.env.MONGODB_URI}/${databaseName}` || '' ,{})

         connectionState.isConnected=db.connections[0].readyState
         
         const connection =mongoose.connection
         connection.on('connected',()=>{
            console.log('DB connected successfully')
            
         })
         connection.on('error',()=>{
             console.log('encounter with error at connected DB')
             process.exit(1)
         })

     } 
     catch (error:any) {
         console.log("failed connecting to database ",error?.message)   
         process.exit(1)
     }
}

export default connectDB;