import React from 'react'
import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { Sparkles, Leaf, ShieldCheck } from "lucide-react";

function Why() {
    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">

                {/* Image Section with Modern Floating Card Effect */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative aspect-[4/5] w-full"
                >
                    <div className="absolute inset-0 bg-accent/20 rounded-[2rem] transform rotate-3" />
                    <div className="relative h-full w-full overflow-hidden rounded-[2rem] shadow-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2000&auto=format&fit=crop"
                            alt="Natural Ingredients"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-8 left-8 text-white">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">Since 2024</span>
                            <p className="mt-4 text-xl font-light"> Balanced Health, Limitless Living</p>
                        </div>
                    </div>
                </motion.div>

                {/* Content Section */}
                <div className="space-y-12">
                    <SectionHeader
                        label="Why Fiveetatva"
                        title="Crafted with Intention"
                        description="We believe in uncompromising quality. Our formulations are crafted with ethically sourced herbs, standardized for potency, and backed by ancient Ayurvedic wisdom."
                        align="left"
                    />

                    <div className="grid gap-6">
                        {[
                            { title: "Standardized Extracts", desc: "Clinically proven potency in every dose.", icon: <Sparkles size={22} /> },
                            { title: "Ethically Sourced", desc: "From sustainable farms directly to you.", icon: <Leaf size={22} /> },
                            { title: "Ayush Approved", desc: "Certified authentic formulations.", icon: <ShieldCheck size={22} /> },
                        ].map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="group p-6 rounded-2xl bg-white border border-slate-100 hover:border-accent/20 hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 flex gap-5 items-center"
                            >
                                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-inner">
                                    {benefit.icon}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-semibold text-slate-900">{benefit.title}</h3>
                                    <p className="text-sm text-slate-500 font-light">{benefit.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Why