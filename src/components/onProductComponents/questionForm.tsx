import { useState } from "react";
import { SyntheticEvent } from "react";
import { newQuestionType } from "../../../types";

export default function QuestionForm({
  productId,
  handleNewQuestion,
}: {
  productId: string;
  handleNewQuestion: (question: newQuestionType) => void;
}) {
  const [question, setQuestion] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/questions/newQuestion", {
      method: "POST",
      body: JSON.stringify({
        question: question,
        productId: productId,
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    setQuestion("");
    const data = await response.json();

    return handleNewQuestion(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-3 font-semibold">Ask the seller</p>
      <input
        className="border-2 border-gray-200 rounded-lg px-2 py-2.5 w-3/5 text-sm focus:ring-blue-500"
        type="text"
        placeholder="Write your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 
              font-medium rounded-lg text-sm px-7 py-2.5 -mt-5 dark:bg-blue-600 
              dark:hover:bg-blue-700 focus:outline-none hover:scale-105 dark:focus:ring-blue-800 ml-3 transition-all"
      >
        Ask
      </button>
    </form>
  );
}
