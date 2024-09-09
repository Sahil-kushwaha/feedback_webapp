import {z} from 'zod'

export const signUpSchema = z.object({
      identifier: z.string(),
      password: z.string(),
})