// Central Brand Configuration File
// Edit this single file to change brand name, phone, WhatsApp, address, and social links

export const BRAND = {
  name: 'TeakAura',
  shortName: 'TeakAura',
  tagline: '20+ Years of Master Craftsmen & 100% Solid Seasoned Teakwood',
  subheadline: 'Direct from our workshop to your home. No veneer. No particle board. Built to last generations.',
  
  // Contact Details (Updated across all buttons and footers)
  phone: '+91 89569 03770',
  phoneDisplay: '+91 89569 03770',
  whatsappNumber: '918956903770', // Digits only with country code (e.g. 91 for India)
  email: 'workshop@teakaura.com',
  
  // Workshop Location & Visiting Hours
  workshopAddress: {
    line1: 'Sr. No. 277, Dhanori Road, Sathe Wasti',
    line2: 'Lohegaon',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411047',
    country: 'India',
    full: 'Sr. No. 277, Dhanori Road, Sathe Wasti, Lohegaon, Pune - 411047, Maharashtra, India',
    mapUrl: 'https://maps.google.com/?q=Sr+No+277+Dhanori+Road+Sathe+Wasti+Lohegaon+Pune+411047',
    embedMapUrl: 'https://maps.google.com/maps?q=Sr%20No%20277,%20Dhanori%20Road,%20Sathe%20Wasti,%20Lohegaon,%20Pune%20411047&t=&z=14&ie=UTF8&iwloc=&output=embed',
    latitude: 18.5913,
    longitude: 73.9169,
  },

  workingHours: 'Monday to Saturday: 9:00 AM – 6:30 PM (Sunday by prior appointment)',
  
  // Trust Metrics & Statistics (Animated on homepage)
  metrics: [
    { value: 20, suffix: '+', label: 'Years of Craftsmanship', sublabel: 'Operating workshop since 2004' },
    { value: 5000, suffix: '+', label: 'Happy Homes Furnished', sublabel: 'Across Pune, Mumbai & Beyond' },
    { value: 100, suffix: '%', label: 'Solid Seasoned Teak', sublabel: 'Zero veneer or particle board' },
    { value: 100, suffix: '%', label: 'Custom Made to Your Size', sublabel: 'Precision joinery & finish' },
  ],

  // Why Choose Us Pillars
  features: [
    {
      title: 'Seasoned Grade-A Teak',
      desc: 'Naturally kiln-seasoned plantation teakwood with moisture below 10% to prevent warping, cracking, or termite infestation for decades.',
      icon: 'TreePine',
    },
    {
      title: 'Master Craftsmen Workshop',
      desc: '3rd-generation woodworkers handcrafting traditional mortise-and-tenon interlocking joints without flimsy hardware dependencies.',
      icon: 'Hammer',
    },
    {
      title: 'Direct From Workshop Price',
      desc: 'Save 30-40% compared to luxury showrooms by cutting out retail middlemen, high showroom markups, and dealer commissions.',
      icon: 'Store',
    },
    {
      title: 'Custom Made To Your Size',
      desc: 'Every home has unique dimensions. We tailor every millimeter of height, width, cushion density, and wood finish tone.',
      icon: 'Ruler',
    },
    {
      title: '10-Year Structural Warranty',
      desc: 'We stand by every joint and beam we make with an authentic written 10-year warranty and lifetime restoration support.',
      icon: 'ShieldCheck',
    },
  ],

  // 4-Step Process
  processSteps: [
    {
      step: '01',
      title: 'Share Your Idea',
      desc: 'Send us your room dimensions, reference photos from Pinterest/Instagram, or pick an existing design from our catalog.',
    },
    {
      step: '02',
      title: 'We Send 3D Design & Quote',
      desc: 'Our craftsmen prepare exact timber specifications, wood finish samples, clear pricing, and estimated workshop timelines.',
    },
    {
      step: '03',
      title: 'We Craft in Our Workshop',
      desc: 'Seasoned teak logs are sawn, planed, hand-jointed, and finished with organic oils. We send photo updates during production.',
    },
    {
      step: '04',
      title: 'Delivered & Installed',
      desc: 'Our white-glove logistics team safely packs, delivers, and installs the finished furniture directly in your home.',
    },
  ],

  // Social Links
  socials: {
    instagram: 'https://instagram.com/teakaura',
    facebook: 'https://facebook.com/teakaura',
    youtube: 'https://youtube.com/@teakaura',
    whatsapp: 'https://wa.me/918956903770',
  },

  // Helper to build WhatsApp direct link with contextual pre-filled message
  getWhatsAppLink(customText?: string) {
    const base = `https://wa.me/${this.whatsappNumber}`;
    const message = customText 
      ? encodeURIComponent(customText)
      : encodeURIComponent(`Hello ${this.name}! I am browsing your teakwood furniture catalog and would like to consult with your workshop craftsmen.`);
    return `${base}?text=${message}`;
  },

  getProductWhatsAppLink(productName: string, productUrl?: string) {
    const text = `Hello ${this.name}! I am interested in customizing "${productName}". Could you please share the pricing, wood finish options, and workshop delivery timeline? ${productUrl ? '\nProduct Link: ' + productUrl : ''}`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }
};
