function HowItWorks() {
  return (
    <section
      id="how"
      className="py-24"
    >

      <div className="mx-auto max-w-6xl px-6">

        {/* Heading */}
        <div className="text-center">

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
            Process
          </span>

          <h2 className="mt-5 text-4xl font-bold">
            How it works
          </h2>

          <p className="mt-4 text-gray-500">
            Get started in minutes and begin practicing with our
            AI-powered interview system.
          </p>

        </div>


        {/* Steps */}
        <div className="mt-20 grid gap-12 md:grid-cols-3">

          <Step
            number="01"
            title="Choose Your Role"
            text="Select your target position and industry to get relevant questions."
          />

          <Step
            number="02"
            title="Practice Interview"
            text="Answer questions with our AI interviewer in a realistic environment."
          />

          <Step
            number="03"
            title="Get Feedback"
            text="Receive detailed analysis and tips to improve your performance."
          />

        </div>

      </div>

    </section>
  );
}


function Step({ number, title, text }) {
  return (
    <div className="text-center">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#050516] text-lg font-semibold text-white">
        {number}
      </div>

      <h3 className="mt-6 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-4 text-gray-500">
        {text}
      </p>

    </div>
  );
}

export default HowItWorks;