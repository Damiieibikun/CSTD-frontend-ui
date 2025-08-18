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
  
const editAdminSchema = z
  .object({
    firstname: z.string().min(1, "*First name is required"),
    lastname: z.string().min(1, "*Last name is required"), 
    email: z.email({ message: "*Invalid email format" }) 
            .min(1, "*Email is required"),
    phone: z.string().min(10, "*Phone number must be at least 10 digits")
      .regex(
        /^(?:\+234|0)[789][01]\d{8}$/,
        "*Phone number must contain only digits"
      )  
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

// Pages schema
const childLinkSchema = z.object({
  pageName: z.string().min(1, "Page name is required"),
  path: z.string().min(1, "Path is required")
    .regex(/^\/[a-zA-Z0-9\-\/#]*$/, "Path must start with '/'"),
  icon: z.string().optional().transform(val => val?.trim() || "fa:FaRegFile")
    .refine(val => /^fa:[A-Za-z0-9]+$/.test(val), "Icon must follow format 'fa:FaIconName'"),
});


const pageSchema = childLinkSchema.extend({
  pageId: z.string()
    .min(1, "Page ID is required")
    .regex(/^[a-z0-9-]+$/, "Page ID must be lowercase letters, numbers, or hyphens"),
  pageType: z.string().min(1, "Page type is required"),
  children: z.array(z.any()).optional(),
  content: z.any().optional(),
});

// News
const newsSchema = z.object({
  title: z.string().min(3, "Title is required"),
  date: z.string().min(1, "Date is required"), // will store as ISO but display formatted
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  brief: z.string().min(10, "Brief description is required"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  media: z
    .array(
      z.object({
        type: z.enum(["image", "video"]),
        url: z.string().min(1, "Media URL is required"),
        thumbnail: z.string().optional()
      })
    )
    .optional()
});

// Projects
const projectsSchema = z
  .object({
    title: z.string().min(1, "*Project Title cannot be empty"),
    objective: z
      .string()
      .min(5, "*Please provide at least one clear project objective"),
  })
  .loose();

  // Publications
  const publicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  authors: z
    .string()
    .regex(/^([A-Za-z\s]+,\s)*[A-Za-z\s]+$/, "Authors must be comma-separated with a space after each comma"),
  link: z.url("Invalid URL"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be included"),
});

export {newsSchema, projectsSchema, publicationSchema, webmasterSchema, 
  registerAdminSchema, loginSchema, editAdminSchema, changePasswordSchema,
 pageSchema, childLinkSchema};
