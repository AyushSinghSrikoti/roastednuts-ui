import * as yup from "yup";

export const userLoginSchema = yup.object({
  email: yup
    .string()
    .required("Email address is required")
    .email("Enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type UserLoginForm = yup.InferType<typeof userLoginSchema>;
