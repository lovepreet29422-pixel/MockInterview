import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function InterviewSetup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");

  const startInterview = () => {
    localStorage.removeItem("interviewAnswers");
    if (!role || !experience) {
      alert("Please select your role and experience level.");
      return;
    }

    localStorage.setItem(
      "interviewSetup",
      JSON.stringify({
        role,
        experience,
      })
    );

    localStorage.removeItem("interviewAnswers");

    navigate("/interview");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
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

          <Link
            to="/dashboard"
            className="text-sm text-gray-500 hover:text-black"
          >
            Dashboard
          </Link>

        </div>
      </nav>


      {/* Main */}
      <main className="mx-auto max-w-3xl px-6 py-16">

        <div className="text-center">

          <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium">
            Interview Setup
          </span>

          <h1 className="mt-5 text-4xl font-bold">
            Prepare for your interview
          </h1>

          <p className="mt-3 text-gray-500">
            Tell us a little about yourself so we can personalize
            your interview.
          </p>

        </div>


        {/* Setup Card */}
        <div className="mt-10 rounded-2xl border bg-white p-8 shadow-sm">

          {/* Job Role */}
          <div>

            <label className="mb-3 block text-sm font-semibold">
              Select Job Role
            </label>

            <div className="grid gap-3 sm:grid-cols-2">

              {[
                "Frontend Developer",
                "Backend Developer",
                "Full Stack Developer",
                "UI/UX Designer",
              ].map((item) => (

                <button
                  key={item}
                  onClick={() => setRole(item)}
                  className={`rounded-xl border p-4 text-left transition ${
                    role === item
                      ? "border-black bg-gray-100"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <p className="font-medium">
                    {item}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Practice {item} interview questions
                  </p>
                </button>

              ))}

            </div>

          </div>


          {/* Experience */}
          <div className="mt-8">

            <label className="mb-3 block text-sm font-semibold">
              Experience Level
            </label>

            <div className="grid gap-3 sm:grid-cols-3">

              {[
                "Beginner",
                "Intermediate",
                "Experienced",
              ].map((item) => (

                <button
                  key={item}
                  onClick={() => setExperience(item)}
                  className={`rounded-xl border p-4 transition ${
                    experience === item
                      ? "border-black bg-gray-100"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <p className="font-medium">
                    {item}
                  </p>

                </button>

              ))}

            </div>

          </div>


          {/* Summary */}
          {(role || experience) && (
            <div className="mt-8 rounded-xl bg-gray-50 p-5">

              <p className="text-sm text-gray-500">
                Your interview
              </p>

              <p className="mt-2 font-semibold">
                {role || "Select a role"}{" "}
                {experience && `• ${experience}`}
              </p>

            </div>
          )}


          {/* Start */}
          <button
            onClick={startInterview}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[#080817] py-3 font-semibold text-white hover:opacity-90"
          >
            Start Interview
            <ArrowRight size={18} />
          </button>

 


        </div>

      </main>

    </div>
  );
}

export default InterviewSetup;