import {resend} from '@/lb/resend'
import { VerificationEmailTemplate } from '../../emails/VerificationEmailTemplate'
import { ApiResponse } from '@/types/ApiResponse'
export async function sendVerificationEmail(
        email:string,
        username:string,
        verifyCode: string,
        otpValidUpto:number
):Promise<ApiResponse> {
      try {
          
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Feedback | Verification code',
            react: VerificationEmailTemplate({ username ,otp:verifyCode }),
          });

          // below to line of code just for testing purpose only 
          if(error) throw new Error(error.message)
          console.log(data)

          return{
                success:true,
                message:"verificaton email send successfully"
                }
          
      } catch (emailError) {
         console.error("Error sending verification email",emailError)
         return{success:false,message:"sending verificaton email failed"}
      }
}

// chose to make the return type a Promise<ApiResponse> because the function sendVerificationEmail is asynchronous. Here’s why this is important: