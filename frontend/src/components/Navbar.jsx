import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white">

      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#080817] text-white">
            💬
          </div>

          <span className="text-lg font-bold">
            MockInterview
          </span>

        </Link>


        {/* Navigation */}
        <div className="hidden gap-8 text-sm text-gray-500 md:flex">

          <a
            href="/#features"
            className="hover:text-black"
          >
            Features
          </a>

          <a
            href="/#how"
            className="hover:text-black"
          >
            How It Works
          </a>

          <a
            href="/#pricing"
            className="hover:text-black"
          >
            Pricing
          </a>

        </div>


        {/* Buttons */}
        <div className="flex items-center gap-4">

          <Link
            to="/login"
            className="hidden text-sm font-medium md:block"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-[#080817] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Get Started
          </Link>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;