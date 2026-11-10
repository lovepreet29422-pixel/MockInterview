
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Clock,
  LogOut,
  Play,
  Trophy,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch interview history from MongoDB
  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/interviews",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch interviews");
      }

      const data = await response.json();

      // Support both array and object API responses
      const interviewList = Array.isArray(data)
        ? data
        : Array.isArray(data.interviews)
        ? data.interviews
        : [];

      setInterviews(interviewList);
    } catch (error) {
      console.error("Error loading interviews:", error);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  // Total interviews
  const totalInterviews = interviews.length;

  // Average score
  const averageScore =
    totalInterviews > 0
      ? Math.round(
          interviews.reduce(
            (total, interview) =>
              total + Number(interview.score || 0),
            0
          ) / totalInterviews
        )
      : 0;

  // Best score
  const bestScore =
    totalInterviews > 0
      ? Math.max(
          ...interviews.map((interview) =>
            Number(interview.score || 0)
          )
        )
      : 0;

  // Total practice time
  const totalMinutes = interviews.reduce(
    (total, interview) =>
      total + Number(interview.durationMinutes || 0),
    0
  );

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#080817] text-white">
              💬
            </div>

            <span className="text-lg font-bold">
              MockInterview
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-500 sm:block">
              Welcome back!
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

        </div>
      </nav>

      {/* MAIN */}
      <main className="mx-auto max-w-6xl px-6 py-12">

        {/* HEADING */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back 👋
          </h1>

          <p className="mt-2 text-gray-500">
            Track your interview preparation and improve your skills.
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={<Trophy size={20} />}
            title="Interviews Completed"
            value={totalInterviews}
          />

          <StatCard
            icon={<BarChart3 size={20} />}
            title="Average Score"
            value={`${averageScore}%`}
          />

          <StatCard
            icon={<Trophy size={20} />}
            title="Best Score"
            value={`${bestScore}%`}
          />

          <StatCard
            icon={<Clock size={20} />}
            title="Practice Time"
            value={`${hours}h ${minutes}m`}
          />

        </div>

        {/* START INTERVIEW */}
        <div className="mt-8 rounded-2xl bg-[#080817] p-8 text-white">

          <h2 className="text-2xl font-bold">
            Ready for your next interview?
          </h2>

          <p className="mt-2 text-gray-300">
            Practice with AI-powered interview questions and improve your skills.
          </p>

          <Link
            to="/interview-setup"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-black transition hover:bg-gray-100"
          >
            <Play size={18} />
            Start Interview
            <ArrowRight size={18} />
          </Link>

        </div>

        {/* PERFORMANCE */}
        <div className="mt-8 rounded-2xl border bg-white p-6">

          <h2 className="text-xl font-bold">
            Your Performance
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {totalInterviews === 0
              ? "Complete your first interview to see your performance."
              : averageScore >= 80
              ? "Excellent! Your interview performance is very strong. 🎉"
              : averageScore >= 60
              ? "Good progress! Keep practicing to improve your score. 👍"
              : "Keep practicing and focus on improving your weak areas. 💪"}
          </p>

          {totalInterviews > 0 && (
            <div className="mt-6">

              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium">
                  Average Performance
                </span>

                <span className="font-bold">
                  {averageScore}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-3 rounded-full bg-[#080817] transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, averageScore))}%`,
                  }}
                />
              </div>

            </div>
          )}

        </div>

        {/* RECENT INTERVIEWS */}
        <div className="mt-10">

          <h2 className="text-2xl font-bold">
            Recent Interviews
          </h2>

          {/* LOADING */}
          {loading && (
            <div className="mt-5 rounded-2xl border bg-white p-8 text-center">
              <p className="text-gray-500">
                Loading interviews...
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && interviews.length === 0 && (
            <div className="mt-5 rounded-2xl border bg-white p-8 text-center">

              <p className="text-gray-500">
                No interviews completed yet.
              </p>

              <Link
                to="/interview-setup"
                className="mt-4 inline-block rounded-lg bg-[#080817] px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                Start Your First Interview
              </Link>

            </div>
          )}

          {/* INTERVIEW LIST */}
          {!loading && interviews.length > 0 && (
            <div className="mt-5 overflow-hidden rounded-2xl border bg-white">

              {[...interviews]
                .sort(
                  (a, b) =>
                    new Date(b.date || 0) -
                    new Date(a.date || 0)
                )
                .slice(0, 5)
                .map((interview, index) => (
                  <InterviewRow
                    key={interview._id || index}
                    role={interview.role}
                    experience={interview.experience}
                    score={interview.score}
                    date={interview.date}
                    duration={interview.durationMinutes}
                  />
                ))}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}

// STAT CARD
function StatCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
          {icon}
        </div>

        <p className="text-sm text-gray-500">
          {title}
        </p>
      </div>

      <p className="mt-5 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
}

// INTERVIEW ROW
function InterviewRow({
  role,
  experience,
  score,
  date,
  duration,
}) {
  const safeScore = Math.min(
    100,
    Math.max(0, Number(score) || 0)
  );

  return (
    <div className="flex flex-col gap-4 border-b p-6 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <p className="font-semibold">
          {role || "Mock Interview"}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {experience || "Not specified"}
          {" • "}
          {formatDate(date)}
        </p>

        {Number(duration) > 0 && (
          <p className="mt-1 text-xs text-gray-400">
            Practice time: {duration} minutes
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">

        <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#080817]"
            style={{
              width: `${safeScore}%`,
            }}
          />
        </div>

        <span className="font-bold">
          {safeScore}%
        </span>

      </div>

    </div>
  );
}

// DATE FORMAT
function formatDate(date) {
  if (!date) return "Unknown date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default Dashboard;
