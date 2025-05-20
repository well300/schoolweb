import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
// import Lottie from "lottie-react";
// import pawAnimation from "./paw.json"; // Replace with your Lottie JSON
// import tailWag from "./tail-wag.json"; // Replace with your Lottie JSON

const App = () => {
  const [images, setImages] = useState({
    cat: "",
    dog: "",
    fish: "",
  });
  const [loading, setLoading] = useState({
    cat: true,
    dog: true,
    fish: true,
  });
  const [hoveredCard, setHoveredCard] = useState(null);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const fetchImage = async (animal) => {
    try {
      setLoading(prev => ({ ...prev, [animal]: true }));
      
      if (animal === "cat") {
        const res = await fetch("https://api.thecatapi.com/v1/images/search");
        const data = await res.json();
        setImages(prev => ({ ...prev, cat: data[0].url }));
      } else if (animal === "dog") {
        const res = await fetch("https://dog.ceo/api/breeds/image/random");
        const data = await res.json();
        setImages(prev => ({ ...prev, dog: data.message }));
      } else if (animal === "fish") {
        setImages(prev => ({
          ...prev,
          fish: "https://source.unsplash.com/random/800x600/?fish,aquarium"
        }));
      }
      
      setTimeout(() => {
        setLoading(prev => ({ ...prev, [animal]: false }));
      }, 800); // Minimum loading time for smooth UX
    } catch (err) {
      console.error(`Error fetching ${animal}:`, err);
      setLoading(prev => ({ ...prev, [animal]: false }));
    }
  };

  useEffect(() => {
    fetchImage("cat");
    fetchImage("dog");
    fetchImage("fish");
  }, []);

  const animals = ["cat", "dog", "fish"];

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 overflow-x-hidden"
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-noise opacity-10"></div>
        <motion.div 
          style={{ y }}
          className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-violet-900/20"
        />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 pt-20 pb-16 px-6 text-center"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="inline-block"
        >
          <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 font-space-grotesk mb-4">
            Fauna<span className="text-white">.</span>Gallery
          </h1>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl text-purple-100 max-w-2xl mx-auto font-satoshi"
        >
          An immersive exploration of nature's most charming creatures
        </motion.p>
        
        <motion.div 
          animate={{ 
            y: [0, -10, 0],
            transition: { 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut"
            }
          }}
          className="mt-8"
        >
          {/* <Lottie animationData={pawAnimation} className="w-24 h-24 mx-auto" /> */}
        </motion.div>
      </motion.header>

      {/* Main content */}
      <main className="relative z-10 pb-32 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {animals.map((animal, index) => (
            <motion.div
              key={animal}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                ease: [0.16, 0.77, 0.47, 0.97]
              }}
              whileHover={{ 
                y: -10,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              onHoverStart={() => setHoveredCard(animal)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative"
            >
              {/* Glassmorphism card */}
              <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
                {/* Card header */}
                <div className="p-6 pb-0">
                  <motion.h2 
                    className="text-3xl font-bold text-white capitalize mb-2 font-playfair-display"
                    animate={{
                      color: hoveredCard === animal ? 
                        "var(--tw-gradient-to)" : 
                        "var(--tw-text-opacity)"
                    }}
                  >
                    {animal}
                  </motion.h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full mb-4"></div>
                </div>
                
                {/* Image container */}
                <div className="relative aspect-square overflow-hidden">
                  <AnimatePresence mode="wait">
                    {loading[animal] ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-gray-900/20"
                      >
                        {/* <Lottie 
                          animationData={animal === "dog" ? tailWag : pawAnimation} 
                          className="w-32 h-32" 
                        /> */}
                      </motion.div>
                    ) : (
                      <motion.img
                        key="image"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        src={images[animal]}
                        alt={animal}
                        className="w-full h-full object-cover"
                        style={{
                          filter: "brightness(0.95) contrast(1.1) saturate(1.1)",
                          mixBlendMode: "luminosity"
                        }}
                      />
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Card footer */}
                <div className="p-6 pt-4">
                  <motion.button
                    onClick={() => fetchImage(animal)}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ 
                      scale: 1.05,
                      background: "linear-gradient(45deg, #ec4899, #8b5cf6)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 text-white font-medium font-satoshi flex items-center justify-center gap-2"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="animate-spin-fast"
                    >
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                      <path d="M16 16h5v5" />
                    </svg>
                    Generate New
                  </motion.button>
                </div>
              </div>
              
              {/* Floating decorative element */}
              <motion.div
                animate={{
                  opacity: hoveredCard === animal ? 0.3 : 0,
                  scale: hoveredCard === animal ? 1 : 0.8,
                  transition: { duration: 0.4 }
                }}
                className="absolute -z-10 inset-0 bg-gradient-to-br from-pink-500/30 to-violet-500/30 blur-2xl rounded-3xl"
              />
            </motion.div>
          ))}
        </div>
        
        {/* Footer decorative */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-24 text-center"
        >
          <p className="text-white/60 font-satoshi">
            Made with ♥ for animal lovers everywhere
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default App;