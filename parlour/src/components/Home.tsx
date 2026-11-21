import Hero from "./Hero";
import Services from "./Services";
import About from "./About";
import Gallary from "./Gallary";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Gallary />
    </>
  );
};

export default Home;