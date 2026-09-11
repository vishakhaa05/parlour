const Hero: React.FC = () => {
  return (
    <section className="grid grid-cols-2 px-16 py-20 bg-pink-80">
      
      {/* Left content */}
      <div className="pt-10">
        <h1 className="text-5xl font-bold leading-tight">
          <span className="text-pink-400">Beauty</span> That
          <br />
          <span className="text-gray-800">Glows Naturally</span>
        </h1>

        <p className="mt-6 text-gray-600">
          Relax • Refresh • Glow
        </p>

        <p className="mt-4 text-gray-500 max-w-md">
          Experience premium beauty and spa services that
          enhance your natural glow.
        </p>

        <button className="mt-8 bg-pink-400 text-white px-6 py-3 rounded-full shadow-lg">
          Get Appointment
        </button>
      </div>

      {/* Right image */}
      <div className="flex justify-center">
        <img
          src="/hero.png"
          alt="hero"
          className="w-[420px]"
        />
      </div>
    </section>
  );
};

export default Hero;