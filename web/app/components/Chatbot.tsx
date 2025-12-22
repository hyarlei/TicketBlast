"use client";

import { useChat } from "ai/react";
import { useState } from "react";

export function Chatbot() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 h-100 w-75 flex flex-col rounded-lg border border-gray-200 bg-white shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-3 text-white font-bold flex justify-between">
            <span>🤖 TicketBlast AI</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <p className="text-sm text-gray-500 text-center mt-4">
                Olá! Sou a IA do TicketBlast. Pergunte sobre preços ou o evento!
                🎟️
              </p>
            )}
            {messages.map(
              (m: {
                id: string;
                role: "user" | "assistant" | "system";
                content: string;
              }) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                      }`}
                  >
                    {m.content}
                  </div>
                </div>
              )
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t p-3 bg-white flex gap-2"
          >
            <input
              className="flex-1 rounded border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={input}
              onChange={handleInputChange}
              placeholder="Digite sua dúvida..."
            />
            <button
              type="submit"
              className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 transition-colors"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-transform hover:scale-110"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}
