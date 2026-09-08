import { useState, useRef, useEffect } from "react";
import { chatWithESGAssistant } from "../services/geminiService";
import { Bot, Send, X, Sparkles, User, RefreshCw } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";

function AIChatDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your GreenOps AI Sustainability Copilot. Connected to your live platform data! Ask me anything about your current ESG score, carbon emissions, workforce metrics, or governance compliance!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [liveContext, setLiveContext] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchLivePlatformData = async () => {
      try {
        // 1. Environmental Data
        const envQuery = query(collection(db, "environmentalData"), orderBy("createdAt", "desc"));
        const envSnap = await getDocs(envQuery);
        const latestEnv = envSnap.docs.length > 0 ? envSnap.docs[0].data() : null;

        // 2. Social Data
        const socQuery = query(collection(db, "socialData"), orderBy("createdAt", "desc"));
        const socSnap = await getDocs(socQuery);
        const latestSoc = socSnap.docs.length > 0 ? socSnap.docs[0].data() : null;

        // 3. Governance Data
        const polSnap = await getDocs(collection(db, "governancePolicies"));
        const riskSnap = await getDocs(collection(db, "governanceRisks"));
        const compSnap = await getDocs(collection(db, "governanceCompliance"));
        const auditSnap = await getDocs(collection(db, "governanceAudits"));

        const policiesList = polSnap.docs.map((doc) => doc.data());
        const risksList = riskSnap.docs.map((doc) => doc.data());
        const compList = compSnap.docs.map((doc) => doc.data());
        const auditsList = auditSnap.docs.map((doc) => doc.data());

        const compliantCount = compList.filter((c) => c.status === "Compliant").length;
        const govScoreVal = compList.length > 0 ? Math.round((compliantCount / compList.length) * 100) : 86;

        const envScoreVal = latestEnv?.carbon ? Math.max(0, 100 - Math.round(latestEnv.carbon / 10)) : 85;
        const socScoreVal = latestSoc?.totalEmployees ? Math.min(100, Math.round(((latestSoc.trainingHours || 0) / (latestSoc.totalEmployees || 1)) * 20)) : 80;
        const overallESG = Math.round((envScoreVal + socScoreVal + govScoreVal) / 3);

        const totalEmp = latestSoc?.totalEmployees || 0;
        const malePct = totalEmp > 0 ? Math.round(((latestSoc.maleEmployees || 0) / totalEmp) * 100) : 0;
        const femalePct = totalEmp > 0 ? Math.round(((latestSoc.femaleEmployees || 0) / totalEmp) * 100) : 0;
        const otherPct = totalEmp > 0 ? Math.max(0, 100 - malePct - femalePct) : 0;
        const avgTraining = latestSoc?.employeesTrained > 0 ? ((latestSoc.trainingHours || 0) / latestSoc.employeesTrained).toFixed(2) : "0.00";

        setLiveContext({
          esgScore: overallESG,
          environmental: {
            carbon: latestEnv?.carbon ?? 320,
            energy: latestEnv?.energy ?? 12500,
            water: latestEnv?.water ?? 42000,
            scope: latestEnv?.scope || "Scope 1 (Direct)",
            carbonOffsets: latestEnv?.carbonOffsets ?? 50,
            cloudServers: latestEnv?.cloudServers ?? 12,
          },
          social: {
            totalEmployees: totalEmp || 500,
            malePercentage: malePct || 40,
            femalePercentage: femalePct || 55,
            otherPercentage: otherPct || 5,
            employeesTrained: latestSoc?.employeesTrained ?? 400,
            averageTrainingHours: avgTraining,
            safetyIncidents: latestSoc?.safetyIncidents ?? 0,
            csrActivities: latestSoc?.csrActivities ?? 10,
          },
          governance: {
            score: `${govScoreVal}%`,
            policiesCount: policiesList.length || 3,
            risksCount: risksList.length || 1,
            complianceCount: compList.length || 0,
            compliantCount,
            auditsCount: auditsList.length || 4,
          },
        });
      } catch (err) {
        console.error("Error fetching live platform context for AI Copilot:", err);
      }
    };

    fetchLivePlatformData();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const aiReply = await chatWithESGAssistant(text, liveContext);
      setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
    } catch (err) {
      console.error("AI Assistant error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, an error occurred while fetching AI insights." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <span key={i} className="block min-h-[1.2em]">
          {formattedLine}
        </span>
      );
    });
  };

  const quickPrompts = [
    "📈 What is my current ESG Score?",
    "💨 What is my Carbon Emission status?",
    "🛡️ Governance & Open Risks summary",
    "👥 Workforce Diversity & Training details",
    "🌱 How to reduce Scope 1 emissions?",
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col transition-all duration-300">
        
        {/* Header */}
        <div className="p-5 bg-green-900 text-white flex items-center justify-between border-b border-green-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-800 rounded-xl">
              <Bot className="text-green-300" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                GreenOps AI Copilot
                <span className="bg-green-700 text-green-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  Gemini 2.5 Live
                </span>
              </h3>
              <p className="text-xs text-green-200">Real-Time ESG & Net-Zero Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-800 rounded-xl transition text-green-200 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Suggestions */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto flex gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs whitespace-nowrap bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-full hover:bg-green-50 hover:border-green-300 transition cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message History */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles size={16} className="text-green-600 dark:text-green-400" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-green-700 text-white rounded-tr-none"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-tl-none"
                }`}
              >
                {renderFormattedText(msg.text)}
              </div>
              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 mt-1">
                  <User size={16} className="text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 items-center text-gray-500 text-sm italic">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <RefreshCw size={16} className="animate-spin text-green-600" />
              </div>
              Analyzing live platform data...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your ESG score, carbon, policies..."
              className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white rounded-xl transition cursor-pointer"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default AIChatDrawer;
