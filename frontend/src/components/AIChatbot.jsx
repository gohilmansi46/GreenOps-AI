import { useState, useEffect, useRef } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import { askGemini } from "../services/geminiService";

function AIChatbot({ latestData, esgScore }) {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const chatbotRef = useRef(null);
  
  const handleAsk = async () => {
    if (!message.trim()) return;

    setLoading(true);

    const dashboardContext = `
    Current ESG Dashboard Data:

    Carbon Emissions: ${latestData?.carbon ?? "N/A"} tCO₂
    Energy Usage: ${latestData?.energy ?? "N/A"} kWh
    Water Consumption: ${latestData?.water ?? "N/A"} L
    ESG Score: ${esgScore}/100

    User Question:
    ${message}
    `;

    const reply = await askGemini(dashboardContext);

    setResponse(reply);

    setLoading(false);
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      chatbotRef.current &&
      !chatbotRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
  }, []);

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 z-50"
      >
        <FaRobot className="text-2xl" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
  ref={chatbotRef}
  className="fixed bottom-24 right-6 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">

          {/* Header */}
          <div className="bg-green-600 text-white px-5 py-4 flex justify-between items-center">

            <div className="flex items-center gap-3">
              <FaRobot className="text-xl" />

              <div>
                <h2 className="font-semibold">
                  ESG AI Assistant
                </h2>

                <p className="text-xs text-green-100">
                  Powered by Gemini AI
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-200"
            >
              <FaTimes />
            </button>

          </div>

          {/* Body */}
          <div className="p-5">

            <textarea
              rows="4"
              placeholder="Ask about carbon emissions, ESG score, sustainability..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
                }
                }}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 text-gray-700 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none resize-none"
            />

            <button
              onClick={handleAsk}
              disabled={loading}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 rounded-xl transition-all duration-300"
            >
              {loading ? "Thinking..." : "Ask AI"}
            </button>

            {response && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 max-h-64 overflow-y-auto">

                <div className="flex items-center gap-2 mb-3">
                  <FaRobot className="text-green-600" />

                  <h3 className="font-semibold text-green-700">
                    AI Response
                  </h3>
                </div>

                <div className="whitespace-pre-wrap text-gray-700 leading-7 text-sm">
                  {response}
                </div>

              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;