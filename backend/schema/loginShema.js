import { z } from 'zod'
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const LoginSchema = z.object({

  email: z.string({ required_error: 'Email title is required' })
    .email({ message: 'Email address must be a valid email' }).max(50, { message: 'Email address must be less than  50 characters' }), /*  .refine(value => emailFormat.test(value), { message: 'Incorrect Email Format' }) */
  password: z.string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must be more than 8 characters' })
    .refine(value => passwordPattern.test(value), { message: 'Incorrect Password Format' })
})

// Export the schema
export default LoginSchema

export function validateLogin (object) {
  return LoginSchema.safeParse(object)
}
