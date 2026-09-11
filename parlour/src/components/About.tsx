const About = () => {
  return (
    <section className="bg-pink-50 py-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        
        {/* Image */}
        <div className="flex justify-center">
          <img
            src="/image3.png"
            alt="About Shree Ambika Beauty Parlour"
            className="w-full max-w-sm rounded-2xl shadow-md"
          />
        </div>

        {/* Content */}
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            About <span className="text-pink-400">Shree Ambika</span>
          </h2>

          <p className="text-gray-600 mb-6">
            Shree Ambika Beauty Parlour offers premium beauty and spa services
            focused on care, comfort, and natural glow. We believe in making
            every client feel confident and refreshed.
          </p>

          <button className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-full transition">
            Learn More
          </button>
        </div>

      </div>
    </section>
  );
};

export default About;