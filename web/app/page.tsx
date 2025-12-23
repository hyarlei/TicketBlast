"use client";

import { useState } from "react";
import Chatbot from "./components/Chatbot";

const API_URL = "https://ticketblast-api.onrender.com";

type Notification = {
  id: number;
  message: string;
  type: "success" | "error";
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [ticketUrl, setTicketUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [ticketType, setTicketType] = useState<"VIP" | "COMUM">("VIP");

  const showNotification = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTicketUrl(null);

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      ticketType: ticketType,
    };

    try {
      const res = await fetch(`${API_URL}/buy-ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.details) {
          const errorMessages = Object.entries(data.details)
            .filter(([key]) => key !== "_errors")
            .map(([field, error]: [string, any]) => {
              const fieldName = field === "name" ? "Nome" : field === "email" ? "E-mail" : "Tipo de ingresso";
              return `${fieldName}: ${error._errors.join(", ")}`;
            })
            .join("\n");
          
          const errorMsg = errorMessages || data.message || "Dados inválidos";
          setError(errorMsg);
          showNotification(`${errorMsg}`, "error");
          return;
        }
        
        const errorMsg = data.message || "Falha ao comprar ingresso";
        setError(errorMsg);
        showNotification(`${errorMsg}`, "error");
        return;
      }

      await new Promise((r) => setTimeout(r, 2000));

      showNotification(
        "Pedido enviado! O Worker está processando seu ingresso.",
        "success"
      );
      e.target.reset();
      setTicketType("VIP");
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
      showNotification(
        "Erro ao conectar com o servidor. Tente novamente.",
        "error"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-4">
      <div className="fixed top-4 left-4 z-50 space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`
              min-w-75 p-4 rounded-lg shadow-2xl border
              animate-slide-in-left
              ${notif.type === "success"
                ? "bg-green-900/90 border-green-600 text-green-100"
                : "bg-red-900/90 border-red-600 text-red-100"
              }
            `}
          >
            <p className="text-sm font-medium">{notif.message}</p>
          </div>
        ))}
      </div>

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

          <div>
            <label className="block text-sm font-medium mb-1">
              Tipo de Ingresso
            </label>
            <select
              name="ticketType"
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value as "VIP" | "COMUM")}
              required
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-600 focus:border-purple-500 focus:outline-none transition cursor-pointer"
            >
              <option value="VIP">VIP - Acesso Premium</option>
              <option value="COMUM">COMUM - Acesso Padrão</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processando..." : `Comprar Ingresso ${ticketType}`}
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
