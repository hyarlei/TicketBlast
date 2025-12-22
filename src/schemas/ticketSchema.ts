import { z } from 'zod';

export const ticketSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 letras"),
  email: z.string().email("E-mail inválido"),
  ticketType: z.enum(["VIP", "COMUM"], {
    message: "Tipo deve ser VIP ou COMUM"
  })
});