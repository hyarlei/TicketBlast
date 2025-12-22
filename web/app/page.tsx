"use client";

import { useState } from "react";
import { Chatbot } from "./components/Chatbot";

const API_URL = "https://ticketblast-api.onrender.com";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [ticketUrl, setTicketUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTicketUrl(null);

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      ticketType: "VIP",
    };

    try {
      const res = await fetch(`${API_URL}/buy-ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Falha ao comprar ingresso");

      await new Promise((r) => setTimeout(r, 2000));

      alert("Pedido enviado! O Worker está processando.");
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
        <h1 className="text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600">
          TicketBlast 🚀
        </h1>
        <p className="text-slate-400 text-center mb-8">
          Garanta seu lugar no futuro.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome Completo
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-600 focus:border-purple-500 focus:outline-none transition"
              placeholder="Ex: Hyarlei Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              name="email"
              type="email"
              required
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-600 focus:border-purple-500 focus:outline-none transition"
              placeholder="seu@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processando..." : "Comprar Ingresso VIP"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-900/50 text-red-200 rounded-lg text-center text-sm border border-red-800">
            {error}
          </div>
        )}
      </div>
      <Chatbot />
    </main>
  );
}
