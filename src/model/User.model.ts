import mongoose ,{Schema,Document} from "mongoose";

interface Message extends Document{
     content:string,
     createdAt : Date
}

const messageSchema = new Schema<Message>(
    {
         content: {
             type: String,
             required:true
         },
         createdAt:{
            type: Date,
            required:true,
            default:Date.now

         }
    }
)

interface User extends Document{
      username:string,
      email:string,
      password:string,
      isVerify: boolean
      verifyCode: string,
      verifyCodeExpiry: Date
      isAcceptingMesaage: boolean
      message :Message[]
}

const userSchema = new Schema<User>({
    username:{
          type:String,
          required: [true ,"username required"],
          unique: true,
          trim:true
     },
    email:{
        type: String,
        required:[true , "email required"],
        unique: true,
        match:[/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/ ,'Enter the valid email Address']

    },
    password:{
         type: String,
         required:[true , 'password required']
    },

    isVerify:{
         type: Boolean,
         defualt:false
    },

    verifyCode: {
        type: String,
        required:[true , 'verifycode required']
   },
    verifyCodeExpiry: {
        type: Date,
        required:[true , 'Date required']
   },
    isAcceptingMesaage: {
        type: Boolean,
        default:true
   },
    message :[messageSchema]
})

export const MessageModel = (mongoose.models.messages as mongoose.Model<Message>)|| mongoose.model<Message>('messages',messageSchema)
export const UserModel =( mongoose.models.users as mongoose.Model<User>) || mongoose.model<User>('users',userSchema)
