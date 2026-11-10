import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white py-14">

      <div className="mx-auto max-w-6xl px-6">

        <div className="grid gap-10 md:grid-cols-4">

          {/* Logo */}
          <div>

            <Link
              to="/"
              className="flex items-center gap-2"
            >

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#080817] text-white">
                💬
              </div>

              <span className="font-semibold">
                MockInterview
              </span>

            </Link>


            <p className="mt-5 text-sm leading-6 text-gray-500">
              Helping professionals ace their interviews with
              AI-powered practice sessions.
            </p>

          </div>


          {/* Product */}
          <FooterColumn
            title="Product"
            links={[
              "Features",
              "Pricing",
              "API",
            ]}
          />


          {/* Company */}
          <FooterColumn
            title="Company"
            links={[
              "About",
              "Blog",
              "Careers",
            ]}
          />


          {/* Support */}
          <FooterColumn
            title="Support"
            links={[
              "Help Center",
              "Contact",
              "Privacy",
            ]}
          />

        </div>


        {/* Copyright */}
        <div className="mt-12 border-t pt-8 text-center text-sm text-gray-500">
          © 2024 MockInterview. All rights reserved.
        </div>

      </div>

    </footer>
  );
}


function FooterColumn({ title, links }) {
  return (
    <div>

      <h3 className="font-semibold">
        {title}
      </h3>

      <div className="mt-5 space-y-3">

        {links.map((link) => (
          <a
            href="#"
            key={link}
            className="block text-sm text-gray-500 hover:text-black"
          >
            {link}
          </a>
        ))}

      </div>

    </div>
  );
}

export default Footer;