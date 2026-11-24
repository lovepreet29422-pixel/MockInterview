import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "https://mockinterview-hmtp.onrender.com/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem("token", data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    navigate("/dashboard");

  } catch (error) {
    console.log(error);
    alert("Server error");
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">

      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">

        {/* Logo */}
        <div className="mb-8 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#080817] text-xl text-white">
            💬
          </div>

          <h1 className="mt-4 text-2xl font-bold">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue practicing
          </p>

        </div>


        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="mb-5">

            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />

          </div>


          {/* Password */}
          <div className="mb-6">

            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />

          </div>


          <button
            type="submit"
            className="w-full rounded-lg bg-[#080817] py-3 font-medium text-white"
          >
            Sign In
          </button>

        </form>


        <p className="mt-6 text-center text-sm text-gray-500">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-semibold text-black"
          >
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;