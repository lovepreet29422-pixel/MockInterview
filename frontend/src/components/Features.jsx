import {
  Target,
  MessageSquare,
  BarChart3,
  Calendar,
  Users,
  Shield,
} from "lucide-react";

import FeatureCard from "./FeatureCard";

function Features() {
  return (
    <section
      id="features"
      className="bg-gray-50 py-24"
    >

      <div className="mx-auto max-w-6xl px-6">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">

          <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium">
            Features
          </span>

          <h2 className="mt-5 text-4xl font-bold">
            Everything you need to succeed
          </h2>

          <p className="mt-4 text-gray-500">
            Our comprehensive platform provides all the tools and feedback
            you need to master your interview skills.
          </p>

        </div>


        {/* Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">

          <FeatureCard
            icon={<Target size={22} />}
            title="Tailored Questions"
            text="Get questions specific to your role and industry, powered by our extensive database."
          />

          <FeatureCard
            icon={<MessageSquare size={22} />}
            title="Real-time Feedback"
            text="Receive instant analysis on your answers, tone, and body language."
          />

          <FeatureCard
            icon={<BarChart3 size={22} />}
            title="Progress Tracking"
            text="Monitor your improvement over time with detailed analytics and insights."
          />

          <FeatureCard
            icon={<Calendar size={22} />}
            title="Flexible Scheduling"
            text="Practice anytime, anywhere with our 24/7 available AI interviewer."
          />

          <FeatureCard
            icon={<Users size={22} />}
            title="Multiple Formats"
            text="Practice behavioral, technical, and case study interviews all in one place."
          />

          <FeatureCard
            icon={<Shield size={22} />}
            title="Secure & Private"
            text="Your practice sessions are completely private and secure."
          />

        </div>

      </div>

    </section>
  );
}

export default Features;