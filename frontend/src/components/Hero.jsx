import { ArrowRight, Play, BarChart3, Check } from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="overflow-hidden">

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">

        {/* Left Side */}
        <div>

          <span className="inline-block rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium">
            ✦ AI-Powered Interview Practice
          </span>


          <h1 className="mt-6 text-5xl font-bold leading-tight md:text-6xl">
            Ace Your Next
            <br />
            Interview
          </h1>


          <p className="mt-6 max-w-lg text-lg leading-7 text-gray-500">
            Practice with AI-powered mock interviews, get real-time
            feedback, and boost your confidence before the real thing.
          </p>


          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              to="/register"
              className="flex items-center gap-2 rounded-lg bg-[#080817] px-5 py-3 text-sm font-semibold text-white"
            >
              Start Free Practice
              <ArrowRight size={17} />
            </Link>


            <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold">
              <Play size={16} />
              Watch Demo
            </button>

          </div>


          {/* Users */}
          <div className="mt-10 flex items-center gap-3">

            <div className="flex">

              <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-200" />

              <div className="-ml-2 h-8 w-8 rounded-full border-2 border-white bg-gray-300" />

              <div className="-ml-2 h-8 w-8 rounded-full border-2 border-white bg-gray-400" />

            </div>

            <span className="text-sm text-gray-500">
              10,000+ interviews practiced
            </span>

          </div>

        </div>


        {/* Right Side */}
        <div className="relative">

          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80"
            alt="Interview"
            className="h-[550px] w-full rounded-2xl object-cover"
          />


          {/* Progress Card */}
          <div className="absolute right-[-10px] top-[-20px] flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-lg">

            <div className="rounded-full bg-blue-100 p-2">
              <BarChart3
                size={20}
                className="text-blue-600"
              />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Progress
              </p>

              <p className="text-xs text-gray-500">
                12 interviews
                <br />
                done
              </p>
            </div>

          </div>


          {/* Complete Card */}
          <div className="absolute bottom-[-20px] left-[-15px] flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-lg">

            <div className="rounded-full bg-green-100 p-2">
              <Check
                size={20}
                className="text-green-600"
              />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Interview
              </p>

              <p className="text-xs text-gray-500">
                Complete
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;