
import { useState } from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

// Load Razorpay Checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const Pricing = () => {
  const [loadingPlan, setLoadingPlan] = useState("");

  const plans = [
    {
      name: "Free",
      price: "₹0",
      description: "Start practicing for free",
      features: [
        "3 mock interviews",
        "Basic feedback",
        "Common interview questions",
        "Basic progress tracking",
      ],
      buttonText: "Get Started",
      free: true,
    },
    {
      name: "Pro",
      price: "₹19",
      description: "For serious interview preparation",
      features: [
        "Unlimited mock interviews for 30 days",
        "AI-powered feedback",
        "Role-based interview questions",
        "Detailed performance analysis",
        "Voice interview practice",
      ],
      buttonText: "Pay ₹19",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "₹49",
      description: "For advanced interview preparation",
      features: [
        "Everything in Pro",
        "Advanced AI feedback",
        "Communication improvement tips",
        "Detailed interview reports",
        "Personalized improvement suggestions",
      ],
      buttonText: "Pay ₹49",
    },
  ];

  const handlePayment = async (planName) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first to purchase a plan.");
      window.location.href = "/login";
      return;
    }

    try {
      setLoadingPlan(planName);

      // Step 1: Load Razorpay Checkout
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error("Razorpay Checkout could not be loaded. Please try again.");
      }

      // Step 2: Create order from backend
      const orderResponse = await fetch(
        "https://mockinterview-c8gh.onrender.com/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plan: planName }),
        }
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || "Could not create payment order.");
      }

      // Step 3: Configure Razorpay Checkout
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MockInterview",
        description: `${planName} Plan - 30 Days`,
        order_id: orderData.orderId,

        prefill: {
          name: user.name || "",
          email: user.email || "",
        },

        theme: {
          color: "#4F46E5",
        },

        // Step 4: Verify payment on backend
        handler: async function (response) {
          try {
            const verifyResponse = await fetch(
              "https://mockinterview-c8gh.onrender.com/api/payment/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.message || "Payment verification failed."
              );
            }

            // Update saved user plan information
            const updatedUser = {
              ...user,
              plan: planName,
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));

            alert(
              `Payment successful! Your ${planName} plan is now activated for 30 days.`
            );

            setLoadingPlan("");

            // Refresh the page to display updated plan
            window.location.reload();
          } catch (error) {
            console.error("PAYMENT VERIFICATION ERROR:", error);
            alert(error.message || "Payment verification failed.");
            setLoadingPlan("");
          }
        },

        modal: {
          ondismiss: function () {
            setLoadingPlan("");
          },
        },
      };

      // Step 5: Open Razorpay Checkout
      const razorpay = new window.Razorpay(options);

      // Step 6: Display detailed payment failure information
      razorpay.on("payment.failed", function (response) {
        console.error(
          "PAYMENT FAILED:",
          JSON.stringify(response.error, null, 2)
        );

        const error = response.error || {};

        alert(
          `Payment Failed!\n\n` +
            `Reason: ${error.reason || "Unknown"}\n` +
            `Description: ${
              error.description || "Please try again."
            }\n` +
            `Code: ${error.code || "Not available"}`
        );

        setLoadingPlan("");
      });

      razorpay.open();
    } catch (error) {
      console.error("PAYMENT ERROR:", error);
      alert(error.message || "Something went wrong. Please try again.");
      setLoadingPlan("");
    }
  };

  return (
    <section
      id="pricing"
      className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-indigo-600 font-semibold mb-3">
            SIMPLE PRICING
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Choose Your Plan
          </h2>

          <p className="mt-4 text-gray-600 text-lg">
            Start for free and upgrade when you need more features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-8 shadow-lg border transition duration-300 hover:-translate-y-2 hover:shadow-xl ${
                plan.popular
                  ? "border-indigo-600 ring-2 ring-indigo-100"
                  : "border-gray-200"
              }`}
            >
              {/* Popular Label */}
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-full">
                  Most Popular
                </span>
              )}

              {/* Plan Details */}
              <h3 className="text-2xl font-bold text-gray-900">
                {plan.name}
              </h3>

              <p className="text-gray-500 mt-2 min-h-12">
                {plan.description}
              </p>

              <div className="mt-6 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>

                {!plan.free && (
                  <span className="text-gray-500 ml-2">
                    / 30 days
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-600"
                  >
                    <Check
                      size={20}
                      className="text-green-500 shrink-0 mt-0.5"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              {plan.free ? (
                <Link
                  to="/register"
                  className="block w-full text-center py-3 px-5 rounded-lg border-2 border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
                >
                  {plan.buttonText}
                </Link>
              ) : (
                <button
                  onClick={() => handlePayment(plan.name)}
                  disabled={loadingPlan !== ""}
                  className={`w-full py-3 px-5 rounded-lg font-semibold text-white transition ${
                    plan.popular
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-900 hover:bg-gray-800"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {loadingPlan === plan.name
                    ? "Processing..."
                    : plan.buttonText}
                </button>
              )}
            </div>
          ))}

        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Secure payments powered by Razorpay. Paid plans provide access
          for 30 days after successful payment verification.
        </p>

      </div>
    </section>
  );
};

export default Pricing;
