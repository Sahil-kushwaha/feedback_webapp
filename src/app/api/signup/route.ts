import { NextRequest,NextResponse } from "next/server";
import { UserModel } from "@/model/User.model";
import { signUpSchema } from "@/schema/signInSchema";
import { SignUpBody } from "@/types/SignUpBody"
import connectDB from "@/lb/database";
import bcrypt from 'bcrypt'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
export async function POST(request:NextRequest){
     await connectDB() 
     try {
         
         const body:SignUpBody = await request.json()
         signUpSchema.parse(body)
         const {username ,password ,email} = body 
         
         const existingUserVerifyiedByUsername = await UserModel.findOne({
             username,
             isVerified: true
            })
            
            if(existingUserVerifyiedByUsername){
                // username exist and verified also
                return NextResponse.json({
                    success: false,
                    message: "Username is already exist"
                },{status:400}) 
            }
            
            // if we execution reached here that means user by username may does not exist in database or exist in db but does not verify now check by email
            const existingUserVerifyiedByEmail = await UserModel.findOne({email})
            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpExpiry = new Date();
            otpExpiry.setHours(otpExpiry.getHours()+1)
            const otpValidUpto =1 // 1hr

           if(existingUserVerifyiedByEmail){
                // user exist in db by provided email by user
                // let check is user verifed or not , 
                if(existingUserVerifyiedByEmail.isVerified){
                       return NextResponse.json({
                              success: false,
                              message: 'User already exist with this email'
                       })
                }
                else{ 
                      // just recreate or update the password,verifyCode and send verify email (user do so bcz may otp get expired)
                      const hashPass = await bcrypt.hash(password,10)
                      existingUserVerifyiedByEmail.password=hashPass 
                      existingUserVerifyiedByEmail.verifyCode= otp.toString(),
                      existingUserVerifyiedByEmail.verifyCodeExpiry= otpExpiry,
                      await existingUserVerifyiedByEmail.save()
                      //send the email with new otp ()
                    }
                }

           else{
                    // register new user by given details bcz no one user exist in database with given email and username or may be exist with provided username but not get verifed till now that's why username assign to otheronez   
                    
                    const hashPass = await bcrypt.hash(password,10)
                    const newUser = new UserModel({
                             username,
                             email,
                             password:hashPass,
                             isVerified: false,
                             verifyCode: otp.toString(),
                             verifyCodeExpiry: otpExpiry,
                             isAcceptingMesaage: true,
                             message :[]
                     })
                      await newUser.save();
                }
                
            // send email with new otp i do that here bcz i don't need to write same code , when new user created and may user opt get expired    
            const emailResponse = await sendVerificationEmail(email,username,otp.toString(),otpValidUpto)
            if(!emailResponse.success){
                return NextResponse.json(
                    {
                     message:emailResponse.message,
                     success:true   
                    },
                    {status:500}
                 )
            }
            return NextResponse.json({
                     message:"User register successfully please verify your email",
                     success: true
            },{status:201})
    
     } catch (error) {
         console.error('Error registring user' ,error)
         return NextResponse.json(
                {       success : false,
                        message:"Error registering user"
                },
                {status:500}
         )
     }
}