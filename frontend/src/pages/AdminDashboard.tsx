import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUploadDataset = async () => {
    if (files.length === 0) {
      setMessage("⚠️ Please select images first.");
      return;
    }

    setUploading(true);
    setMessage("");
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/dataset/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!response.ok) throw new Error("Dataset upload failed.");

      const data = await response.json();
      setMessage(`✅ Uploaded ${data.uploadedFiles} images successfully!`);
      setFiles([]);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 p-6">
      {/* Dashboard Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/30"
      >
        <h2 className="text-2xl font-bold text-white text-center">
          Admin Panel - {user?.username} 🚀
        </h2>
        <p className="text-white/80 text-sm text-center mt-2">
          Upload dataset images for model training.
        </p>

        {/* Success / Error Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-3 text-center rounded-lg ${
              message.startsWith("✅")
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* File Upload Input */}
        <div className="mt-6">
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="w-full file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 transition-all"
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUploadDataset}
          disabled={uploading}
          className="w-full mt-4 flex justify-center items-center bg-white text-purple-700 font-semibold py-2 rounded-lg shadow-lg hover:bg-purple-500 hover:text-white transition-all duration-200"
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Upload Dataset"
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
