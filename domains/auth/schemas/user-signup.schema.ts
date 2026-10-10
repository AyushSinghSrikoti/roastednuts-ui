import * as yup from "yup";

export const userSignupSchema = yup.object({
  email: yup
    .string()
    .required("Email address is required")
    .email("Enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[0-9]/, "Password must contain a number")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain a special character",
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export type UserSignupForm = yup.InferType<typeof userSignupSchema>;
