import HeroSlider from '@/components/HeroSlider';
import ClientSlider from '@/components/ClientSlider';

export default function Home() {
  const heroSlides = [
    {
      id: 1,
      image: 'slider1.jpg',
      heading: 'From Our Farms To Your Hands',
      text: 'Welcome To TenTwenty Farms',
    },
    {
      id: 2,
      image: 'slider2.jpg',
      heading: 'Fresh Harvests Delivered Daily',
      text: 'Welcome To TenTwenty Farms',
    },
    {
      id: 3,
      image: 'slider3.jpg',
      heading: 'Sustainable Organic Farming',
      text: 'Welcome To TenTwenty Farms',
    },
    {
      id: 4,
      image: 'slider4.jpg',
      heading: 'Professional Team',
      text: 'Welcome To TenTwenty Farms',
    },
  ];

  const clients = [
    {
      id: 1,
      image: 'clientslider1.png',
      name: 'Client 1',
      place:'Dubai, United Arab Emirates'
    },
    {
      id: 2,
      image: 'clientslider2.png',
      name: 'Client 2',
      place:'Dubai, United Arab Emirates'
    },
    {
      id: 3,
      image: 'clientslider3.png',
      name: 'Client 3',
      place:'Dubai, United Arab Emirates'
    },
    {
      id: 4,
      image: 'clientslider1.png',
      name: 'Client 4',
      place:'Dubai, United Arab Emirates'
    },
    {
      id: 5,
      image: 'clientslider2.png',
      name: 'Client 5',
      place:'Dubai, United Arab Emirates'
    },
    {
      id: 6,
      image: 'clientslider3.png',
      name: 'Client 6',
      place:'Dubai, United Arab Emirates'
    },
    
  ];

  return (
    <div>
      <HeroSlider slides={heroSlides} interval={5500} />
      <div className="container mx-auto pt-18 pb-12 px-4">
        <h1 className="text-[56px] text-black font-light text-center mb-8">Quality Products</h1>
        <p className="text-[24px] font-light text-[#7A7777] text-center max-w-2xl mx-auto"> 
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
      <ClientSlider clients={clients} />
    </div>
  );
}