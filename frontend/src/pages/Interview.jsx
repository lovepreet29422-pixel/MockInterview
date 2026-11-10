import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Interview() {
  const navigate = useNavigate();

  const setup =
    JSON.parse(localStorage.getItem("interviewSetup")) || {};

  const role = setup.role || "Frontend Developer";
  const experience = setup.experience || "Beginner";

  const questions = {
    "Frontend Developer": {
      Beginner: [
        "Tell me about yourself.",
        "What is HTML?",
        "What is CSS?",
        "What is JavaScript?",
        "What is React?"
      ],

      Intermediate: [
        "Tell me about yourself.",
        "What is the difference between props and state?",
        "What are React hooks?",
        "What is the virtual DOM?",
        "How do you make a website responsive?"
      ],

      Experienced: [
        "Tell me about yourself.",
        "How would you optimize a React application?",
        "Explain React performance optimization.",
        "How would you design a large frontend application?",
        "How do you handle frontend security?"
      ]
    },

    "Backend Developer": {
      Beginner: [
        "Tell me about yourself.",
        "What is a server?",
        "What is Node.js?",
        "What is an API?",
        "What is a database?"
      ],

      Intermediate: [
        "What is REST API?",
        "What is middleware?",
        "What is authentication?",
        "What is the difference between SQL and NoSQL?",
        "How do you handle API errors?"
      ],

      Experienced: [
        "How would you design a scalable backend?",
        "How do you improve API performance?",
        "How would you secure a backend application?",
        "Explain database indexing.",
        "How would you handle millions of API requests?"
      ]
    },

    "Full Stack Developer": {
      Beginner: [
        "Tell me about yourself.",
        "What is frontend development?",
        "What is backend development?",
        "What is an API?",
        "What is a database?"
      ],

      Intermediate: [
        "How does frontend communicate with backend?",
        "What is REST API?",
        "How does authentication work?",
        "How do you connect React with Node.js?",
        "How do you handle errors?"
      ],

      Experienced: [
        "How would you design a full stack application?",
        "How would you scale a web application?",
        "How do you secure a full stack application?",
        "How would you optimize database queries?",
        "How would you design a production-ready application?"
      ]
    },

    "UI/UX Designer": {
      Beginner: [
        "Tell me about yourself.",
        "What is UI design?",
        "What is UX design?",
        "What is a wireframe?",
        "What is user research?"
      ],

      Intermediate: [
        "How do you conduct user research?",
        "What is a design system?",
        "How do you create user personas?",
        "How do you test a design?",
        "What makes a good user interface?"
      ],

      Experienced: [
        "How would you design a product from scratch?",
        "How do you measure UX success?",
        "How do you handle conflicting user requirements?",
        "How do you improve an existing product experience?",
        "How would you lead a design team?"
      ]
    }
  };

  const currentQuestions =
    questions[role]?.[experience] ||
    questions["Frontend Developer"]["Beginner"];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");

  const nextQuestion = () => {
    if (!answer.trim()) {
      alert("Please enter your answer.");
      return;
    }

    const oldAnswers =
      JSON.parse(localStorage.getItem("interviewAnswers")) || [];

    const newAnswers = [
      ...oldAnswers,
      {
        question: currentQuestions[currentQuestion],
        answer: answer.trim()
      }
    ];

    localStorage.setItem(
      "interviewAnswers",
      JSON.stringify(newAnswers)
    );

    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer("");
    } else {
      navigate("/results");
    }
  };

  const progress =
    ((currentQuestion + 1) / currentQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          <Link
            to="/dashboard"
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#080817] text-white">
              💬
            </div>

            <span className="text-lg font-bold">
              MockInterview
            </span>
          </Link>

          <div className="text-sm text-gray-500">
            {role} • {experience}
          </div>

        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-3xl px-6 py-12">

        <div className="text-center">

          <p className="text-sm font-medium text-gray-500">
            {role}
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Interview Practice
          </h1>

          <p className="mt-2 text-gray-500">
            Question {currentQuestion + 1} of{" "}
            {currentQuestions.length}
          </p>

        </div>

        {/* Progress */}
        <div className="mt-8">

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">

            <div
              className="h-full rounded-full bg-[#080817]"
              style={{ width: `${progress}%` }}
            ></div>

          </div>

        </div>

        {/* Question */}
        <div className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Question {currentQuestion + 1}
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            {currentQuestions[currentQuestion]}
          </h2>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="mt-8 min-h-[200px] w-full resize-none rounded-xl border border-gray-200 p-4 outline-none focus:border-black"
          />

          <button
            onClick={nextQuestion}
            className="mt-6 w-full rounded-lg bg-[#080817] py-3 font-semibold text-white hover:opacity-90"
          >
            {currentQuestion === currentQuestions.length - 1
              ? "Finish Interview"
              : "Next Question →"}
          </button>

        </div>

      </main>

    </div>
  );
}

export default Interview;