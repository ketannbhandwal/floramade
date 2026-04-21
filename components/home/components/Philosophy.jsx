import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import SectionHeader from '@/components/ui/SectionHeader'
import { Sprout, Wind, Flame, Droplets, Mountain } from 'lucide-react'

const elementStyles = {
  Akasha: {
    bg: "from-yellow-50 to-amber-50",
    iconBg: "bg-gradient-to-br from-amber-200 to-yellow-300",
    accent: "text-amber-700"
  },
  Vayu: {
    bg: "from-green-50 to-emerald-50",
    iconBg: "bg-gradient-to-br from-green-300 to-emerald-400",
    accent: "text-green-700"
  },
  Agni: {
    bg: "from-orange-50 to-red-50",
    iconBg: "bg-gradient-to-br from-orange-300 to-red-400",
    accent: "text-orange-700"
  },
  Jala: {
    bg: "from-cyan-50 to-blue-50",
    iconBg: "bg-gradient-to-br from-cyan-300 to-blue-400",
    accent: "text-cyan-700"
  },
  Prithvi: {
    bg: "from-stone-50 to-neutral-50",
    iconBg: "bg-gradient-to-br from-stone-300 to-neutral-400",
    accent: "text-stone-700"
  }
}

function Philosophy() {
  const elements = [
    { name: "Akasha", element: "Ether", desc: "Space & Connection", icon: <Sprout size={28} className="text-white" /> },
    { name: "Vayu", element: "Air", desc: "Movement & Vitality", icon: <Wind size={28} className="text-white" /> },
    { name: "Agni", element: "Fire", desc: "Transformation", icon: <Flame size={28} className="text-white" /> },
    { name: "Jala", element: "Water", desc: "Flow & Nourishment", icon: <Droplets size={28} className="text-white" /> },
    { name: "Prithvi", element: "Earth", desc: "Stability & Strength", icon: <Mountain size={28} className="text-white" /> },
  ]

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <SectionHeader
            label="Our Philosophy"
            title="The Five Elements"
            description="Ayurveda teaches that everything in the universe is composed of five fundamental elements that govern our body, mind, and spirit."
            align="center"
          />
        </div>

        {/* 5 elements in a responsive grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {elements.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="h-full"
            >
              <Card className={`group h-full border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${elementStyles[item.name].bg} rounded-3xl overflow-hidden`}>
                <CardContent className="p-6 md:p-8 flex flex-col items-center text-center space-y-4">
                  <motion.div 
                    className={`p-5 md:p-6 rounded-2xl ${elementStyles[item.name].iconBg} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                    whileHover={{ rotate: 12 }}
                  >
                    {item.icon}
                  </motion.div>
                  
                  <div className="space-y-2">
                    <p className={`text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase ${elementStyles[item.name].accent}`}>
                      {item.element}
                    </p>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900">
                      {item.name}
                    </h3>
                  </div>
                  
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom decorative element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-foreground/50 font-light italic max-w-2xl mx-auto">
            "Balance these five elements within yourself, and you unlock the key to perfect health and harmony."
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Philosophy