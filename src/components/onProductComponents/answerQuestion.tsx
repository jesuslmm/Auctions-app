import { useState, FormEvent } from "react";

export default function AnswerQuestion({
  commentId,
  handleNewAnswer,
}: {
  commentId: string;
  handleNewAnswer: ({
    answerToQuestion,
    questionId,
  }: {
    answerToQuestion: string;
    questionId: string;
  }) => void;
}) {
  const [answer, setAnswer] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/questions/answerQuestion", {
      method: "PUT",
      body: JSON.stringify({
        id: commentId,
        answer: answer,
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    handleNewAnswer({ answerToQuestion: answer, questionId: commentId });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          className="border-2 border-gray-200 rounded-lg px-2 py-2 w-1/3 text-sm focus-within:w-2/3 transition-all "
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        {answer === "" ? null : (
          <button
            className="border-2 ml-2 rounded-xl px-3 py-1 bg-gray-300
           hover:bg-gray-400 hover:border-gray-400 hover:text-white hover:scale-105 transition-all
           font-medium"
          >
            answer
          </button>
        )}
      </form>
    </div>
  );
}
