function Testimonials() {
  return (
    <section className="bg-gray-50 py-24">

      <div className="mx-auto max-w-6xl px-6">

        {/* Heading */}
        <div className="text-center">

          <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium">
            Testimonials
          </span>

          <h2 className="mt-5 text-4xl font-bold">
            Success stories
          </h2>

        </div>


        {/* Testimonials */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">

          <Testimonial
            name="Sarah Johnson"
            role="Software Engineer at Tech Corp"
            text="MockInterview helped me land my dream job at a FAANG company. The feedback was incredibly detailed and actionable."
          />

          <Testimonial
            name="Michael Chen"
            role="Product Manager at StartupXYZ"
            text="I practiced over 20 mock interviews and saw my confidence grow with each session. Highly recommend!"
          />

          <Testimonial
            name="Emily Rodriguez"
            role="Marketing Director at Global Inc"
            text="The AI interviewer felt so real! It prepared me perfectly for behavioral questions."
          />

        </div>

      </div>

    </section>
  );
}


function Testimonial({ name, role, text }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">

      <div className="mb-5 text-lg tracking-widest text-yellow-400">
        ★★★★★
      </div>

      <p className="leading-6 text-gray-600">
        "{text}"
      </p>

      <div className="mt-7">

        <h3 className="font-semibold">
          {name}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {role}
        </p>

      </div>

    </div>
  );
}

export default Testimonials;