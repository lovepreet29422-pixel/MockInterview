function FeatureCard({ icon, title, text }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">

      <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
        {icon}
      </div>

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        {text}
      </p>

    </div>
  );
}

export default FeatureCard;