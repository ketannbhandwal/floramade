import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import SectionHeader from '@/components/ui/SectionHeader'
import { Sprout, Wind, Flame, Droplets, Mountain } from 'lucide-react'

// Soft pastel background colors for a cleaner look
const elementStyles = {
  Akasha: { bg: "bg-orange-50", iconBg: "bg-orange-500" },
  Vayu: { bg: "bg-red-50", iconBg: "bg-red-500" },
  Agni: { bg: "bg-blue-50", iconBg: "bg-blue-500" },
  Jala: { bg: "bg-emerald-50", iconBg: "bg-emerald-500" },
  Prithvi: { bg: "bg-violet-50", iconBg: "bg-violet-500" }
}

function Philosophy() {
  const elements = [
    { name: "Akasha", element: "Ether", desc: "Space & Connection", icon: <Sprout size={24} className="text-white" /> },
    { name: "Vayu", element: "Air", desc: "Movement & Vitality", icon: <Wind size={24} className="text-white" /> },
    { name: "Agni", element: "Fire", desc: "Transformation", icon: <Flame size={24} className="text-white" /> },
    { name: "Jala", element: "Water", desc: "Flow & Nourishment", icon: <Droplets size={24} className="text-white" /> },
    { name: "Prithvi", element: "Earth", desc: "Stability & Strength", icon: <Mountain size={24} className="text-white" /> },
  ]

  return (
    <section className="py-24 px-6 ">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <SectionHeader
            label="Our Philosophy"
            title="The Five Elements"
            description="Ayurveda teaches that everything in the universe is composed of five fundamental elements."
            align="center"
          />
        </div>

        {/* 3 columns in one row (centered) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {elements.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="group h-full p-8 border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white rounded-2xl">
                <CardContent className="p-0 flex flex-col items-center text-center space-y-5">
                  <div className={`p-4 rounded-2xl ${elementStyles[item.name].iconBg}`}>
                    {item.icon}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">
                      {item.element}
                    </p>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {item.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-slate-500 leading-relaxed font-light max-w-[200px]">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Philosophy