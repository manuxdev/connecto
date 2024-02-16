import z from 'zod'

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
// const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const usernameFormat = /^[a-zA-Z0-9.\-_$@*!]{3,30}$/

const userSchema = z.object({
  username: z.string({ invalid_type_error: 'Username must bue a string', required_error: 'Username is required' })
    .max(50, { message: 'Username must be less than  50 characters' })
    .refine(value => usernameFormat.test(value), { message: 'Incorrect Username Format' }),
  password: z.string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must be more than 8 characters' })
    .refine(value => passwordPattern.test(value), { message: 'Incorrect Password Format' }),
  email: z.string({ required_error: 'Email title is required' })
    .email({ message: 'Email address must be a valid email' }).max(50, { message: 'Email address must be less than  50 characters' }), /*  .refine(value => emailFormat.test(value), { message: 'Incorrect Email Format' }) */
  first_name: z.string({ invalid_type_error: 'First Name must bue a string', required_error: 'First Name is required' })
    .max(100, { message: 'First name must be less than  100 characters' }),
  last_name: z.string({ invalid_type_error: 'Last Name must bue a string', required_error: 'Last Name is required' })
    .max(100, { message: 'Last name must be less than  100 characters' }),
  phonenumber: z.string().optional().refine(value => value && /^\d{8}$/.test(value), { message: 'Phone number must be exactly  8 digits' }),
  created_at: z.date().default(() => new Date())
})

export function validateUser (object) {
  return userSchema.safeParse(object)
}
export function validateUserPartial (object) {
  return userSchema.partial().safeParse(object)
}
