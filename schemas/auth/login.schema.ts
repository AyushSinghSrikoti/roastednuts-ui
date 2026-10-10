import * as yup from "yup";

export const loginSchema = yup.object({
  password: yup
    .string()
    .required("Master password is required")
    .min(1, "Master password is required"),
});

export type LoginForm = yup.InferType<typeof loginSchema>;