import { motion } from 'framer-motion';
import { Sparkles, Hammer, TreePine, ShieldCheck, HeartHandshake, MapPin } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { BRAND } from '../config/brand';

const milestones = [
  {
    year: '2004',
    title: 'A Small Workshop in the Timber Belt',
    desc: 'Founded by Master Craftsman Ramachandra with two senior carvers and a simple hand saw, dedicated to preserving traditional temple-style mortise & tenon joinery.',
  },
  {
    year: '2010',
    title: 'Kiln Seasoning & Wood Curing Facility',
    desc: 'Invested in our dedicated wood drying chambers to ensure timber moisture drops below 10%, permanently solving seasonal wood warping and cracking.',
  },
  {
    year: '2017',
    title: 'Pan-India Bespoke Commissions',
    desc: 'Expanded beyond Karnataka into Mumbai, Hyderabad, and Delhi NCR, crafting architectural teak doors, heavy live-edge tables, and heirloom wardrobes for homes and heritage estates.',
  },
  {
    year: '2024+',
    title: '20 Years & 5000+ Happy Homes',
    desc: 'Now employing 18 master woodworkers, turners, and cane weavers, still crafting every single piece completely made-to-order without assembly-line shortcuts.',
  },
];

const masterCraftsmen = [
  {
    name: 'Ustad Ramachandra',
    role: 'Founder & Senior Joinery Master',
    experience: '38 years woodworking',
    bio: 'Specialist in load-bearing structural timber and invisible mortise-and-tenon joints.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Govindappa',
    role: 'Master Temple Carving & Motifs',
    experience: '26 years woodcarving',
    bio: 'Hand-carves Chettinad temple medallions, floral rosettes, and fluted pillar details.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Manjunath',
    role: 'Hand-Rubbed Polish & Finishing Specialist',
    experience: '20 years in natural finishes',
    bio: 'Expert in extracting natural golden tones using virgin linseed oils and organic beeswax.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  },
];

export function AboutPage() {
  return (
    <>
      <SEO
        title="Our Workshop Story & 20-Year Heritage | Master Teak Craftsmen"
        description="Learn about TeakAura's 20+ year journey. Meet our master craftsmen, explore our seasoned timber sourcing, and see how our workshop manufactures heirloom solid teak furniture."
      />

      <div className="bg-cream-50 min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-28 bg-teak-950 text-cream-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-teak-950 via-teak-950/70 to-transparent" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold-400/20 text-gold-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentic Woodworking Heritage</span>
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-cream-50">
              Two Decades of Honest Woodworking
            </h1>
            <p className="max-w-2xl mx-auto text-teak-200 text-base sm:text-lg font-light leading-relaxed">
              We never set out to build a giant factory. Our dream was simple: build furniture the honest way, using 100% seasoned teak logs, precision hand-cut joints, and natural oil finishes.
            </p>
          </div>
        </section>

        {/* Philosophy & Values */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-teak-200/80 shadow-warm-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teak-900 text-gold-400 flex items-center justify-center">
                <TreePine className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-teak-950">100% Solid Seasoned Timber</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Zero MDF, zero particle board, and zero fake veneers. Even the backs of our wardrobes, inner drawer bases, and bed slats are cut from solid teak.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-teak-200/80 shadow-warm-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teak-900 text-gold-400 flex items-center justify-center">
                <Hammer className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-teak-950">Mortise & Tenon Joinery</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Modern furniture wobbles and squeaks after a year because of cheap metal brackets. We carve wood that interlocks with wood—stronger than steel.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-teak-200/80 shadow-warm-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teak-900 text-gold-400 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-teak-950">Direct Craftsman Relationship</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                You speak directly with the workshop team that shapes your timber. We share progress photos over WhatsApp at every milestone.
              </p>
            </div>
          </div>
        </section>

        {/* 20-Year Timeline */}
        <section className="py-20 bg-cream-100 border-y border-teak-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold-600 text-xs font-semibold uppercase tracking-widest block mb-2">
                Our Journey
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-teak-950">
                20+ Years of Craftsmanship
              </h2>
            </div>

            <div className="relative border-l-2 border-teak-300 ml-4 sm:ml-32 space-y-12">
              {milestones.map((item, idx) => (
                <div key={idx} className="relative pl-8 sm:pl-10">
                  {/* Timeline Year Badge on left */}
                  <div className="sm:absolute sm:-left-32 sm:top-0 font-serif text-xl font-bold text-teak-900 mb-1 sm:mb-0">
                    {item.year}
                  </div>

                  {/* Bullet */}
                  <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-gold-500 border-4 border-white shadow-sm" />

                  <div className="bg-white p-6 rounded-2xl border border-teak-200/80 shadow-warm-sm">
                    <h3 className="font-serif text-lg font-bold text-teak-950 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Master Craftsmen */}
        <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold-600 text-xs font-semibold uppercase tracking-widest block mb-2">
              The Hands Behind The Grain
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-teak-950">
              Meet Our Senior Craftsmen
            </h2>
            <p className="mt-3 text-stone-600 text-sm">
              Craftsmanship cannot be automated. Every curve, mortise, and bevel is cut by master woodworkers with decades of intuitive knowledge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {masterCraftsmen.map((c, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-teak-200/80 shadow-warm-sm group">
                <div className="aspect-[4/3] overflow-hidden bg-teak-100">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <div className="text-gold-600 text-xs font-semibold uppercase tracking-wider">
                    {c.experience}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-teak-950">
                    {c.name}
                  </h3>
                  <div className="text-sm font-medium text-teak-800">
                    {c.role}
                  </div>
                  <p className="text-stone-600 text-xs leading-relaxed pt-2 border-t border-teak-100">
                    {c.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
