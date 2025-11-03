import { z } from "zod";

export const loanSimulationSchema = z.object({
  amount: z
    .number({ message: "El monto debe ser un número" })
    .min(500000, "El monto mínimo es $500,000")
    .max(50000000, "El monto máximo es $50,000,000"),

  termInMonths: z
    .number({ message: "El plazo debe ser un número" })
    .min(6, "El plazo mínimo es 6 meses")
    .max(60, "El plazo máximo es 60 meses")
    .int("El plazo debe ser un número entero"),
});

export const loanApplicationSchema = z.object({
  amount: z
    .number()
    .min(500000, "El monto mínimo es $500,000")
    .max(50000000, "El monto máximo es $50,000,000"),

  termInMonths: z
    .number()
    .min(6, "El plazo mínimo es 6 meses")
    .max(60, "El plazo máximo es 60 meses")
    .int("El plazo debe ser un número entero"),

  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Debe aceptar los términos y condiciones",
  }),

  acceptHabeasData: z.boolean().refine((val) => val === true, {
    message: "Debe aceptar el tratamiento de datos personales",
  }),
});

export const clientRegistrationSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras"),

  lastName: z
    .string()
    .min(2, "Los apellidos deben tener al menos 2 caracteres")
    .max(50, "Los apellidos no pueden tener más de 50 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "Los apellidos solo pueden contener letras"
    ),

  email: z.string().email("Ingrese un correo electrónico válido").toLowerCase(),

  phone: z
    .string()
    .regex(
      /^3\d{9}$/,
      "Ingrese un número de celular válido (10 dígitos, iniciando con 3)"
    ),

  documentType: z.enum(["CC", "CE", "PA"], {
    message: "Seleccione un tipo de documento",
  }),

  documentNumber: z
    .string()
    .min(7, "El número de documento debe tener al menos 7 caracteres")
    .max(15, "El número de documento no puede tener más de 15 caracteres")
    .regex(/^\d+$/, "El número de documento solo puede contener números"),

  branch: z.enum(
    ["ejercito", "armada", "fuerza_aerea", "policia", "pensionado"],
    { message: "Seleccione una fuerza o entidad" }
  ),

  rank: z
    .string()
    .min(2, "El rango debe tener al menos 2 caracteres")
    .max(30, "El rango no puede tener más de 30 caracteres"),
});

export type LoanSimulationForm = z.infer<typeof loanSimulationSchema>;
export type LoanApplicationForm = z.infer<typeof loanApplicationSchema>;
export type ClientRegistrationForm = z.infer<typeof clientRegistrationSchema>;
