import { z } from 'zod';

const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;
const PK_PHONE_REGEX = /^(03\d{9}|\+923\d{9})$/;

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    cnic: z.string().regex(CNIC_REGEX, 'Format must be 12345-1234567-1'),
    phone: z.string().regex(PK_PHONE_REGEX, 'Use a valid Pakistani number, e.g. 03001234567'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    studentId: z.string().min(1, 'Student ID is required'),
    program: z.string().min(1, 'Program is required'),
    semester: z.coerce.number().min(1).max(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });
