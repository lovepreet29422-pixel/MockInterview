
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

// Convert Gemini score (0-10) into percentage (0-100).
const toPercent = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) return 0;

  return Math.min(100, Math.max(0, Math.round(number * 10)));
};

// Safely handle arrays.
const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

function Results() {
  const navigate = useNavigate();
  const evaluationStarted = useRef(false);

  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveWarning, setSaveWarning] = useState("");

  const durationMinutes = 12;

  useEffect(() => {
    if (evaluationStarted.current) return;

    evaluationStarted.current = true;

    const evaluateInterview = async () => {
      try {
        setLoading(true);
        setError("");
        setSaveWarning("");

        // Get interview answers from localStorage.
        let savedAnswers;
        let setup;

        try {
          savedAnswers = JSON.parse(
            localStorage.getItem("interviewAnswers") || "[]"
          );

          setup = JSON.parse(
            localStorage.getItem("interviewSetup") || "{}"
          );
        } catch {
          throw new Error(
            "Unable to read interview data. Please complete your interview again."
          );
        }

        const token = localStorage.getItem("token");

        if (!Array.isArray(savedAnswers) || savedAnswers.length === 0) {
          throw new Error(
            "No interview answers found. Please complete an interview first."
          );
        }

        if (!token) {
          throw new Error(
            "Please log in again before evaluating your interview."
          );
        }

        const role = setup.role || "Frontend Developer";
        const experience = setup.experience || "Beginner";

        // Validate answers.
        const validAnswers = savedAnswers.filter(
          (item) =>
            typeof item?.question === "string" &&
            item.question.trim() !== "" &&
            typeof item?.answer === "string" &&
            item.answer.trim() !== ""
        );

        if (validAnswers.length === 0) {
          throw new Error(
            "No valid questions and answers found. Please complete your interview again."
          );
        }

        console.log("--------------------------------");
        console.log("Starting batch Gemini evaluation...");
        console.log("Questions:", validAnswers.length);
        console.log("Role:", role);
        console.log("Experience:", experience);
        console.log("--------------------------------");

        // Send all answers in one request with a timeout.
        const controller = new AbortController();

        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 90000);

        let response;
        let data;

        try {
          response = await fetch(`${API_URL}/evaluate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              answers: validAnswers,
              role,
              experience,
            }),
            signal: controller.signal,
          });

          data = await response.json().catch(() => ({}));
        } catch (fetchError) {
          if (fetchError.name === "AbortError") {
            throw new Error(
              "AI evaluation timed out after 90 seconds. Please try again."
            );
          }

          if (fetchError instanceof TypeError) {
            throw new Error(
              "Cannot connect to the backend server. Please make sure your server is running on port 5000."
            );
          }

          throw fetchError;
        } finally {
          clearTimeout(timeoutId);
        }

        console.log("Evaluation response status:", response.status);
        console.log("Evaluation response:", data);

        if (!response.ok || data.success !== true) {
          throw new Error(
            data.message ||
              `Evaluation failed with status ${response.status}.`
          );
        }

        // Validate Gemini response.
        if (
          !Array.isArray(data.evaluations) ||
          data.evaluations.length !== validAnswers.length
        ) {
          throw new Error(
            "Gemini returned incomplete evaluation results. Please try again."
          );
        }

        // Combine original answers with Gemini evaluations.
        const results = data.evaluations.map((item, index) => {
          if (!item || typeof item !== "object") {
            throw new Error(
              `Invalid evaluation received for question ${index + 1}.`
            );
          }

          return {
            question: validAnswers[index].question,
            answer: validAnswers[index].answer,

            score: toPercent(item.score),
            communication: toPercent(item.communication),
            technicalKnowledge: toPercent(item.technicalKnowledge),
            relevance: toPercent(item.relevance),
            answerStructure: toPercent(item.answerStructure),

            feedback:
              typeof item.feedback === "string"
                ? item.feedback
                : "",

            strengths: safeArray(item.strengths),
            improvements: safeArray(item.improvements),

            idealAnswer:
              typeof item.idealAnswer === "string"
                ? item.idealAnswer
                : "",
          };
        });

        // Calculate overall score.
        const calculatedAverage = Math.round(
          results.reduce(
            (total, item) => total + item.score,
            0
          ) / results.length
        );

        setFeedback(results);

        console.log("Gemini evaluation successful.");
        console.log("Overall score:", calculatedAverage);

        // Save evaluated interview to MongoDB.
        try {
          const saveResponse = await fetch(
            `${API_URL}/interviews`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                role,
                experience,
                questions: results,
                score: calculatedAverage,
                durationMinutes,
              }),
            }
          );

          const saveData = await saveResponse
            .json()
            .catch(() => ({}));

          if (!saveResponse.ok || saveData.success !== true) {
            setSaveWarning(
              saveData.message ||
                "Evaluation completed, but results could not be saved to your dashboard."
            );
          } else {
            console.log("Interview saved successfully.");
          }
        } catch (saveError) {
          console.error("Interview save error:", saveError);

          setSaveWarning(
            "Evaluation completed, but results could not be saved to your dashboard."
          );
        }
      } catch (err) {
        console.error("Evaluation error:", err);

        setError(
          err.message || "Something went wrong during evaluation."
        );
      } finally {
        setLoading(false);
      }
    };

    evaluateInterview();
  }, []);

  // Calculate category averages.
  const average = (field) => {
    if (feedback.length === 0) return 0;

    return Math.round(
      feedback.reduce(
        (total, item) => total + (Number(item[field]) || 0),
        0
      ) / feedback.length
    );
  };

  const averageScore = average("score");
  const communication = average("communication");
  const technical = average("technicalKnowledge");
  const relevance = average("relevance");
  const answerStructure = average("answerStructure");

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

          <Link
            to="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Dashboard
          </Link>

        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-12">

        {/* Page Heading */}
        <div className="text-center">

          <p className="text-sm font-medium text-gray-500">
            Interview Complete
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Your AI Interview Results 🎉
          </h1>

          <p className="mt-3 text-gray-500">
            Here's how you performed during your interview.
          </p>

          <div className="mt-4 flex justify-center">

            <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
              ⌨️ Text Interview
            </span>

          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-10 rounded-2xl border bg-white p-10 text-center">

            <div className="text-xl font-semibold">
              🤖 AI is evaluating your answers...
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Please wait while Gemini evaluates your complete interview.
            </p>

            <div className="mx-auto mt-6 h-2 w-48 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-[#080817]" />
            </div>

            <p className="mt-3 text-xs text-gray-400">
              Evaluation may take a little time.
            </p>

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

            <h2 className="text-xl font-semibold text-red-700">
              Evaluation Failed
            </h2>

            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-5 rounded-lg bg-[#080817] px-6 py-3 font-semibold text-white hover:bg-gray-800"
            >
              Back to Dashboard
            </button>

          </div>
        )}

        {/* Successful Results */}
        {!loading && !error && feedback.length > 0 && (
          <>

            {/* Save Warning */}
            {saveWarning && (
              <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                {saveWarning}
              </div>
            )}

            {/* Overall Score */}
            <div className="mx-auto mt-10 max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">

              <p className="text-sm text-gray-500">
                Overall AI Score
              </p>

              <p className="mt-3 text-6xl font-bold">
                {averageScore}%
              </p>

              <p className="mt-3 text-sm text-gray-500">
                {averageScore >= 80
                  ? "Excellent performance! 🎉"
                  : averageScore >= 60
                  ? "Good performance! 👍"
                  : "Keep practicing! 💪"}
              </p>

            </div>

            {/* Category Scores */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">

              <ScoreCard
                title="Communication"
                score={communication}
              />

              <ScoreCard
                title="Technical Knowledge"
                score={technical}
              />

              <ScoreCard
                title="Relevance"
                score={relevance}
              />

              <ScoreCard
                title="Answer Structure"
                score={answerStructure}
              />

            </div>

            {/* Detailed Feedback */}
            <section className="mt-12">

              <h2 className="text-2xl font-bold">
                Detailed Feedback
              </h2>

              <p className="mt-2 text-gray-500">
                Review the AI feedback for each of your answers.
              </p>

              <div className="mt-6 space-y-6">

                {feedback.map((item, index) => (
                  <article
                    key={index}
                    className="rounded-2xl border bg-white p-6 shadow-sm"
                  >

                    <p className="text-sm text-gray-500">
                      Question {index + 1}
                    </p>

                    <h3 className="mt-2 text-xl font-semibold">
                      {item.question}
                    </h3>

                    {/* Score */}
                    <div className="mt-5 inline-block rounded-lg bg-gray-100 px-4 py-2">

                      <span className="text-sm text-gray-500">
                        Score:
                      </span>

                      <span className="ml-2 font-bold">
                        {item.score}/100
                      </span>

                    </div>

                    {/* Candidate Answer */}
                    <div className="mt-5 rounded-xl bg-gray-50 p-5">

                      <p className="text-xs font-semibold uppercase text-gray-400">
                        Your Answer
                      </p>

                      <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-700">
                        {item.answer || "No answer provided."}
                      </p>

                    </div>

                    {/* Feedback */}
                    {item.feedback && (
                      <div className="mt-5">

                        <h4 className="font-semibold">
                          📝 AI Feedback
                        </h4>

                        <p className="mt-2 text-sm leading-7 text-gray-600">
                          {item.feedback}
                        </p>

                      </div>
                    )}

                    {/* Strengths */}
                    <div className="mt-5">

                      <h4 className="font-semibold">
                        ✅ Strengths
                      </h4>

                      {item.strengths.length > 0 ? (
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                          {item.strengths.map((strength, i) => (
                            <li key={i}>{strength}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-gray-500">
                          No strengths returned.
                        </p>
                      )}

                    </div>

                    {/* Improvements */}
                    <div className="mt-5">

                      <h4 className="font-semibold">
                        📈 Areas to Improve
                      </h4>

                      {item.improvements.length > 0 ? (
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                          {item.improvements.map((improvement, i) => (
                            <li key={i}>{improvement}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-gray-500">
                          No improvement suggestions returned.
                        </p>
                      )}

                    </div>

                    {/* Ideal Answer */}
                    <div className="mt-5 rounded-xl border p-5">

                      <h4 className="font-semibold">
                        💡 Suggested Better Answer
                      </h4>

                      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-600">
                        {item.idealAnswer ||
                          "A suggested answer was not provided."}
                      </p>

                    </div>

                  </article>
                ))}

              </div>
            </section>

            {/* Navigation Buttons */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/interview-setup"
                className="flex-1 rounded-lg bg-[#080817] px-6 py-3 text-center font-semibold text-white hover:bg-gray-800"
              >
                Try Again
              </Link>

              <Link
                to="/dashboard"
                className="flex-1 rounded-lg border bg-white px-6 py-3 text-center font-semibold hover:bg-gray-50"
              >
                Back to Dashboard
              </Link>

            </div>

          </>
        )}

      </main>
    </div>
  );
}

function ScoreCard({ title, score }) {
  const safeScore = Math.min(
    100,
    Math.max(0, Number(score) || 0)
  );

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {safeScore}%
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">

        <div
          className="h-2 rounded-full bg-[#080817] transition-all"
          style={{
            width: `${safeScore}%`,
          }}
        />

      </div>

    </div>
  );
}

export default Results;
