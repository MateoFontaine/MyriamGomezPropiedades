import Header from "./components/Header";
import Banner from "./components/Banner";
import WhatsAppWidget from "./components/WhatsAppWidget";
import SobreNosotros from "./components/SobreNosotros";
import Contacto from "./components/Contacto";
import Footer from "./components/Footer";
import PropertyList from "./components/PropertyList";
import CarouselOportunity from './components/PropertyCarousel';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Banner />
      <CarouselOportunity />
      <PropertyList /> {/* <PropertyList count={4} /> en caso de querer que se muestren solo 4 propiedaes */}
      <SobreNosotros />
      <Contacto />
      <Footer />
      <WhatsAppWidget />

    </div>
  );
}

export default App;


