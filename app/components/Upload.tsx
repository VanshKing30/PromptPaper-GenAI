"use client";
import { useEffect, useRef, useState } from "react";

type Source = {
  text: string;
  chunkIndex: number;
  pageNumber: number | null;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};
type UploadedDocument = {
  id: string;
  name: string;
};



export default function PdfUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
const [documents, setDocuments] = useState<UploadedDocument[]>([]);
const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading , setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
    });
}, [messages, loading]);

  const askQuestion = async () => {
    if  (!selectedDocumentId){
      alert("Please upload a PDF first.");
      return;
    }

    if (!question.trim()) {
      alert("Enter a question.");
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
    question,
    documentId: selectedDocumentId,
    history: messages,
}),
      });

      const data = await response.json();

      const aiMessage: Message = {
  role: "assistant",
  content: data.answer,
  sources: data.sources,
};

      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);

      setQuestion("");
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Something went wrong.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const uploadedDocument = {
  id: data.documentId,
  name: selectedFile.name,
};

setDocuments((prev) => [...prev, uploadedDocument]);

setSelectedDocumentId(data.documentId);
        alert("PDF Uploaded Successfully!");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    }
  };

return (
  <div className="flex flex-col gap-4 p-6 border rounded-lg shadow-md w-[500px]">
    <h2 className="text-2xl font-bold">Upload PDF</h2>

    <input
      type="file"
      accept=".pdf"
      onChange={handleFileChange}
    />

    {selectedFile && (
      <p className="text-sm text-green-600">
        Selected: {selectedFile.name}
      </p>
    )}

    <button
      onClick={handleUpload}
      disabled={!selectedFile}
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-500"
    >
      Upload
    </button>

    {/* Uploaded Documents */}

    {documents.length > 0 && (
      <>
        <h3 className="text-lg font-semibold mt-2">
          Uploaded Documents
        </h3>

        <div className="space-y-2">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDocumentId(doc.id)}
              className={`w-full text-left px-3 py-2 rounded border transition ${
                selectedDocumentId === doc.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              📄 {doc.name}
            </button>
          ))}
        </div>
      </>
    )}

    <input
      disabled={loading}
      type="text"
      placeholder="Ask something..."
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !loading) {
          askQuestion();
        }
      }}
      className="border p-2 rounded"
    />

    <button
      onClick={askQuestion}
      disabled={loading || !selectedDocumentId}
      className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
    >
      {loading ? "Thinking..." : "Ask"}
    </button>

    <h3 className="text-lg font-semibold mt-4">
      Conversation
    </h3>

    <div className="space-y-4 mt-6 h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-3 rounded-xl shadow-sm whitespace-pre-wrap break-words max-w-[80%] ${
            message.role === "user"
              ? "bg-blue-500 text-white ml-auto"
              : "bg-gray-200 text-black"
          }`}
        >
          {message.content}

          {message.role === "assistant" &&
            message.sources &&
            message.sources.length > 0 && (
              <div className="mt-4 border-t pt-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  📄 Sources
                </p>

                {message.sources.map((source, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded p-2 text-xs mb-2"
                  >
                    <p>
                      <strong>Page:</strong>{" "}
                      {source.pageNumber ?? "Unknown"}
                    </p>

                    <p>
                      <strong>Chunk:</strong> {source.chunkIndex}
                    </p>

                    <p className="mt-2 line-clamp-3">
                      {source.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
        </div>
      ))}

      {loading && (
        <div className="bg-gray-200 text-black p-3 rounded-lg max-w-[80%]">
          Thinking...
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  </div>
)};