import { z } from "zod";

const webmasterSchema = z
  .object({
    firstname: z.string().min(1, "*First name is required"),
    lastname: z.string().min(1, "*Last name is required"),
    username: z.string().min(1, "*Username is required"),
    email: z.email({ message: "*Invalid email format" }) 
            .min(1, "*Email is required"),
    phone: z.string().min(10, "*Phone number must be at least 10 digits")
      .regex(
        /^(?:\+234|0)[789][01]\d{8}$/,
        "*Phone number must contain only digits"
      ),
    password: z.string().min(6, "*Password must be at least 6 characters")
      .regex(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,}$/,
        "*Must be at least 6 characters, include a number and a special character."
      ),
    passwordConfirm: z.string().min(1, "*Please confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "*Passwords do not match",
  });
const registerAdminSchema = z
  .object({
    firstname: z.string().min(1, "*First name is required"),
    lastname: z.string().min(1, "*Last name is required"), 
    email: z.email({ message: "*Invalid email format" }) 
            .min(1, "*Email is required"),
    phone: z.string().min(10, "*Phone number must be at least 10 digits")
      .regex(
        /^(?:\+234|0)[789][01]\d{8}$/,
        "*Phone number must contain only digits"
      ),
    password: z.string().min(6, "*Password must be at least 6 characters")
      .regex(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,}$/,
        "*Must be at least 6 characters, include a number and a special character"
      ),
    passwordConfirm: z.string().min(1, "*Please confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "*Passwords do not match",
  }).loose();

const loginSchema = z
  .object({
    email: z.email({ message: "*Invalid email format" }) 
            .min(1, "*Email is required"),
    password: z.string().min(1, "*Password cannot be empty"),
  });

const changePasswordSchema = z
  .object({   
     
    currentPassword: z.string().min(1, "*Password cannot be empty"),
    newPassword: z.string().min(6, "*Password must be at least 6 characters")
      .regex(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,}$/,
        "*Must be at least 6 characters, include a number and a special character"
      ),
    passwordConfirm: z.string().min(1, "*Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "*Passwords do not match",
}).loose();

const upcomingProjectsSchema = z
  .object({
    title: z.string().min(1, "*Project Title cannot be empty"),
    objective: z
      .string()
      .min(5, "*Please provide at least one clear project objective"),
  })
  .loose();

export { upcomingProjectsSchema, webmasterSchema, registerAdminSchema, loginSchema, changePasswordSchema };
