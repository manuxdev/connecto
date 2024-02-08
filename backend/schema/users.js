import z from 'zod';

const userSchema = z.object({
  user_handle: z.string({
    invalid_type_error: 'Username must bue a string',
    required_error: 'Username is required'
  }).max(50, { message: 'Username must be less than  50 characters' }),
  email_address: z.string({
    required_error: 'Email title is required'
  }).email({ message: 'Email address must be a valid email' }).max(50, { message: 'Email address must be less than  50 characters' }),
  first_name: z.string({
    invalid_type_error: 'First Name must bue a string',
    required_error: 'First Name is required'
  }).max(100, { message: 'First name must be less than  100 characters' }),
  last_name: z.string({
    invalid_type_error: 'Last Name must bue a string',
    required_error: 'Last Name is required'
  }).max(100, { message: 'Last name must be less than  100 characters' }),
  phonenumber: z.string().optional().refine(value => value && /^\d{8}$/.test(value), { message: 'Phone number must be exactly  8 digits' }),
  created_at: z.date().default(() => new Date())
});

export function validateUser(object) {
  return userSchema.safeParse(object);
}