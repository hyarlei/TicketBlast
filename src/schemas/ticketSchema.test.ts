import { email } from "zod";
import { ticketSchema } from "./ticketSchema";

describe("Validação do ticket", () => {
  it("deve aceitar um email válido e nome completo", () => {
    const dadosValidos = {
        name: "Hyarlei Silva",
        email: "hyarleysf@gmail.com",
        ticketType: "COMUM",
    };

    const result = ticketSchema.safeParse(dadosValidos);
    expect(result.success).toBe(true);
  });
});

it("deve rejeitar e-mail sem @", () => {
    const dadosInvalidos = {
        name: "Hyarlei Freitas",
        email: "hyarleysfgmail.com",
        ticketType: "COMUM",
};

const result = ticketSchema.safeParse(dadosInvalidos);
expect(result.success).toBe(false);
});

it("deve rejeitar nome com menos de duas palavras", () => {
    const dadosInvalidos = {
        name: "hyarlei",
        email: "hyarlei@gmail.com",
        ticketType: "COMUM",
    };

    const result = ticketSchema.safeParse(dadosInvalidos);
    expect(result.success).toBe(false);
});

it("deve rejeitar nome com palavras menores que 2 caracteres", () => {
    const dadosInvalidos = {
        name: "H y",
        email: "hyarleisfgmail.com",
        ticketType: "COMUM",
    };

    const result = ticketSchema.safeParse(dadosInvalidos);
    expect(result.success).toBe(false);
});

it("deve rejeitar tipo de ticket inválido", () => {
    const dadosInvalidos = {
        name: "Hyarlei Silva",
        email: "hyarleysfgmail.com",
        ticketType: "VIP",
    };

    const result = ticketSchema.safeParse(dadosInvalidos);
    expect(result.success).toBe(false);
});

it("deve rejeitar quando faltar o email", () => {
    const dadosInvalidos = {
        name: "Hyarlei Silva",
        ticketType: "COMUM",
    };

    const result = ticketSchema.safeParse(dadosInvalidos);
    expect(result.success).toBe(false);
});

it("deve rejeitar quando faltar o nome", () => {
    const dadosInvalidos = {
        email: "hyarleysfgmail.com",
        ticketType: "COMUM",
    };

    const result = ticketSchema.safeParse(dadosInvalidos);
    expect(result.success).toBe(false);
});

it("deve rejeitar quando faltar o tipo do ticket", () => {
    const dadosInvalidos = {
        name: "Hyarlei Silva",
        email: "hyarleysfgmail.com",
    };

    const result = ticketSchema.safeParse(dadosInvalidos);
    expect(result.success).toBe(false);
});