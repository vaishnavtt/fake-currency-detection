import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const analyzeCurrency = async () => {
    if (!file) {
      setError("⚠️ Please select an image first.");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/verify", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!response.ok) throw new Error("Verification failed.");

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-6">
      {/* Dashboard Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/30"
      >
        <h2 className="text-2xl font-bold text-white text-center">
          Welcome, {user?.username} 👋
        </h2>
        <p className="text-white/80 text-sm text-center mt-2">
          Upload a currency image to check its authenticity.
        </p>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500 text-white p-3 rounded-lg mt-4 text-center shadow-md"
          >
            {error}
          </motion.div>
        )}

        {/* File Upload Input */}
        <div className="mt-6">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-all"
          />
        </div>

        {/* Check Currency Button */}
        <button
          onClick={analyzeCurrency}
          disabled={isAnalyzing}
          className="w-full mt-4 flex justify-center items-center bg-white text-blue-700 font-semibold py-2 rounded-lg shadow-lg hover:bg-blue-500 hover:text-white transition-all duration-200"
        >
          {isAnalyzing ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Check Currency"
          )}
        </button>

        {/* Display Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-white/20 backdrop-blur-lg rounded-lg shadow-lg border border-white/30"
          >
            <p className="text-lg font-semibold text-white">
              Result:{" "}
              {result.isReal ? "✅ Real Currency" : "❌ Fake Currency"}
            </p>
            <p className="text-white/80">
              Confidence: {(result.confidence * 100).toFixed(2)}%
            </p>
            <ul className="mt-2 text-white">
              {result.details.map((detail: string, index: number) => (
                <li key={index} className="text-sm">🔹 {detail}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default UserDashboard;
