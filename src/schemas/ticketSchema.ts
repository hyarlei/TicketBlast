import { z } from "zod";

export const ticketSchema = z.object({
  name: z
    .string({ message: "Nome é obrigatório" })
    .trim()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      "Nome deve conter apenas letras, espaços, apóstrofos ou hífens"
    )
    .refine((val) => val.split(/\s+/).length >= 2, {
      message: "Informe nome completo (nome e sobrenome)",
    }),

  email: z
    .string({ message: "E-mail é obrigatório" })
    .trim()
    .toLowerCase()
    .min(1, "E-mail não pode estar vazio")
    .email("Formato de e-mail inválido")
    .max(255, "E-mail deve ter no máximo 255 caracteres")
    .refine((val) => !val.includes(".."), {
      message: "E-mail não pode conter pontos consecutivos",
    })
    .refine(
      (val) => {
        const domain = val.split("@")[1];
        return domain && domain.includes(".");
      },
      {
        message: "E-mail deve ter um domínio válido",
      }
    ),

  ticketType: z
    .string()
    .transform((val) => val.toUpperCase())
    .pipe(z.enum(["VIP", "COMUM"], { message: "Tipo inválido" })),
});

export type TicketInput = z.infer<typeof ticketSchema>;