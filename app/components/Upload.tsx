"use client";

import { useState } from "react";


export default function PdfUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentId, setDocumentId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");


  const askQuestion = async () => {
    if(!documentId){
      alert("Please upload a pdf first");
      return;
    }

    if(!question.trim()){
      alert("Enter a questions.");
      return;
    }

    const response = await fetch("/api/chat" , {
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
      },
      body : JSON.stringify({
        question,
        documentId,
      })
    });
    const data = await response.json();
    setAnswer(data.answer);
  }
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
      alert("Please select a PDF");
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

      

      

      // This line of code outputs the whole text extraced : console.log(data.extractedText);

      if (data.success) {
        setDocumentId(data.documentId);
        alert("PDF Uploaded Successfully!");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 border rounded-lg shadow-md w-[500px]">
      <h2 className="text-2xl font-bold">Upload PDF</h2>

      <input type="file" accept=".pdf" onChange={handleFileChange} />

      {selectedFile && (
        <p className="text-sm text-green-600">Selected: {selectedFile.name}</p>
      )}

      <button
        onClick={handleUpload}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Upload
      </button>

      <input type="text" placeholder="Ask something" value={question} onChange={(e) => setQuestion(e.target.value)} className="border p-2 rounded" />
      <button
    onClick={askQuestion}
    className="bg-blue-600 text-white px-4 py-2 rounded"
>
    Ask
</button>
{answer && (
    <div className="border rounded p-4">
        <h3 className="font-bold">Answer</h3>

        <p>{answer}</p>
    </div>
)}
    </div>
  );
}
