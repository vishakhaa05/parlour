import toast from "react-hot-toast";

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We will contact you shortly 💖");
  };

  return (
    <section
      id="contact"   
      className="bg-gray-50 py-20 scroll-mt-28"
    >
      <div className="max-w-5xl mx-auto px-6">

        {/* Heading */}
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Contact <span className="text-pink-400">Us</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Contact Info */}
          <div className="space-y-6">
            <p className="text-gray-600">
              Have questions or want to book an appointment?
              Get in touch with us and we’ll be happy to help you.
            </p>

            <div>
              <p className="font-semibold text-gray-700">📍 Address</p>
              <p className="text-gray-600">
                Shree Ambika Beauty Parlour, Main Road, Your City
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-700">📞 Phone</p>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>

            <div>
              <p className="font-semibold text-gray-700">✉️ Email</p>
              <p className="text-gray-600">shreeambika@gmail.com</p>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-md space-y-5"
          >
            <input
              type="text"
              placeholder="Your Name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            <input
              type="email"
              placeholder="Your Email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            <textarea
              placeholder="Your Message"
              rows={4}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            <button
              type="submit"
              className="w-full bg-pink-400 hover:bg-pink-500
              text-white py-3 rounded-full transition"
            >
              Send Message
            </button>
          </form>

        </div>
      </div>
    </section>
  );
};

export default Contact;