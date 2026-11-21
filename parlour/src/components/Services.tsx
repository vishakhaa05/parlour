import { Link } from 'react-router-dom';

interface Service {
  title: string;
  icon: string;
}

const services: Service[] = [
  { title: "Facials", icon: "/image1.png" },
  { title: "Manicure & Pedicure", icon: "/image2.png" },
  { title: "Hair Styling", icon: "/image3.png" },
];

const Services: React.FC = () => {
  return (
    <section className="px-20 py-20 bg-white">
      <h2 className="text-3xl font-bold mb-12">
        Our <span className="text-pink-400">Services</span>
      </h2>

      <div className="grid grid-cols-3 gap-10">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-softGray rounded-xl p-8 text-center shadow-md hover:shadow-xl transition"
          >
            <img
              src={service.icon}
              alt={service.title}
              className="h-16 mx-auto mb-6"
            />
            <h3 className="text-xl font-semibold mb-3">
              {service.title}
            </h3>
            <p className="text-gray-500 text-sm">
              Expert care with premium products.
            </p>

            <Link to="/content">
              <button className="mt-6 text-pink-400 font-medium hover:text-pink-600 transition">
                Learn More
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;