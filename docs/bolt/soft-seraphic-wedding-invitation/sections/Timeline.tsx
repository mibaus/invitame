
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, GlassWater, Music, Heart, Sparkles } from 'lucide-react';

const events = [
  {
    time: "17:00 HRS",
    title: "La Ceremonia",
    description: "Nuestros votos y unión sagrada",
    icon: <Heart className="w-5 h-5 text-[#96adc0]" />,
  },
  {
    time: "18:30 HRS",
    title: "Cóctel de Bienvenida",
    description: "Brindis inicial con música suave",
    icon: <GlassWater className="w-5 h-5 text-[#96adc0]" />,
  },
  {
    time: "20:00 HRS",
    title: "El Banquete",
    description: "Cena bajo la luz de las velas",
    icon: <Sparkles className="w-5 h-5 text-[#96adc0]" />,
  },
  {
    time: "22:00 HRS",
    title: "El Baile",
    description: "Celebración y alegría infinita",
    icon: <Music className="w-5 h-5 text-[#96adc0]" />,
  }
];

const Timeline: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-white/20">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-16"
        >
          <h3 className="font-pinyon text-3xl text-[#96adc0] mb-2">The Fairytale</h3>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#a9a9a9]">Cronograma del Gran Día</p>
        </motion.div>

        <div className="relative">
          {/* Vertical line with gradient */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#c0c0c0] to-transparent -translate-x-1/2" />
          
          <div className="space-y-16">
            {events.map((event, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className={`relative flex items-center justify-between w-full ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Content Side */}
                <div className={`w-[45%] ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <span className="text-[10px] tracking-[0.2em] text-[#96adc0] font-medium block mb-1">{event.time}</span>
                  <h4 className="font-pinyon text-2xl text-[#4a4a4a] mb-1">{event.title}</h4>
                  <p className="text-[11px] text-[#a9a9a9] tracking-wider leading-relaxed">{event.description}</p>
                </div>

                {/* Pearl Center Point */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                   <div className="w-8 h-8 rounded-full bg-white border border-[#c0c0c0] flex items-center justify-center shadow-sm">
                      {event.icon}
                   </div>
                </div>

                {/* Empty side for layout balance */}
                <div className="w-[45%]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
