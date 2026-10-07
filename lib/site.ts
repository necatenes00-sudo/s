export const site = {
  name: 'DEMIR DIGITAL',
  descriptor: 'Creative Agency',
  email: 'hello@demirdigital.com',
  location: 'Ordu — Türkiye',
  // Set the supplied, unmodified logo path here when the owner provides it.
  logo: null as string | null,
  socials: [] as { label: string; url: string }[],
};

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const assetPath = (path: string) => `${basePath}${path}`;

export type Project = {
  slug: string; name: string; title: string; category: string; year: string;
  disciplines: string[]; image: string; imageAlt: string; accent: string;
  description: string; challenge: string; direction: string; experience: string;
  color: string; number: string;
};

export const projects: Project[] = [
  {
    slug: 'limon', name: 'LIMON', title: 'A place to slow down.', category: 'Hospitality', year: '2026',
    disciplines: ['Art direction', 'Brand identity', 'Web experience'], image: '/media/limon.webp', imageAlt: 'Warm architectural atmosphere and an editorial brand composition for Limon',
    accent: '#D1D59C', color: '#202B24', number: '01',
    description: 'A digital atmosphere for a café built around the simple pleasure of staying a little longer. Warm materials, thoughtful typography and a slower visual rhythm.',
    challenge: 'Translate the feeling of a physical space into a clear, inviting online experience without falling into the conventions of a restaurant template.',
    direction: 'An earthy palette meets a precise editorial grid. Photography creates the atmosphere; typography gives the brand a quiet, unmistakable voice.',
    experience: 'A visual approach to discovering the place, exploring its offering and finding your next reason to visit. The concept puts atmosphere and legibility first.',
  },
  {
    slug: 'seyban-performance', name: 'SEYBAN', title: 'Precision in motion.', category: 'Automotive', year: '2026',
    disciplines: ['Digital strategy', 'UI / UX design', '3D experience'], image: '/media/seyban.webp', imageAlt: 'Original machined titanium wheel study on a graphite plinth',
    accent: '#83C9DE', color: '#111B22', number: '02',
    description: 'A study in performance, material and movement. A considered digital identity for the next chapter of mobility.',
    challenge: 'Make technical capability feel intuitive. Create a design language that is precise enough for performance and expressive enough for a premium brand.',
    direction: 'Black chrome, measured blue highlights and architectural typography establish a visual system inspired by engineering rather than spectacle.',
    experience: 'An interface that gives products room to breathe. Specifications become legible, interactions become purposeful, and movement tells a focused story.',
  },
  {
    slug: 'ciger-tarim', name: 'CIĞER TARIM', title: 'Rooted in tomorrow.', category: 'Digital commerce', year: '2026',
    disciplines: ['Brand strategy', 'E-commerce', 'Web development'], image: '/media/ciger.webp', imageAlt: 'Agricultural landscape and a precise commerce brand composition',
    accent: '#BBC7A0', color: '#222C21', number: '03',
    description: 'A modern commerce concept for a business connected to the land. Trust, product clarity and a practical customer journey guide every decision.',
    challenge: 'Build a bridge between an established industry and a confident digital presence. Keep useful information at the centre of the experience.',
    direction: 'Natural textures, clean information systems and restrained colour form a visual language that is rooted, practical and forward looking.',
    experience: 'An approachable product-discovery concept with clear categories and a direct path to enquiry. The focus is on informed choices, not visual noise.',
  },
  {
    slug: 'demir-digital', name: 'DEMIR DIGITAL', title: 'A new digital presence.', category: 'Creative identity', year: '2026',
    disciplines: ['Creative direction', 'Digital identity', 'Motion & 3D'], image: '/media/demir.webp', imageAlt: 'Brushed titanium and electric blue architectural digital object',
    accent: '#00B8FF', color: '#07192C', number: '04',
    description: 'Our own exploration of digital architecture. A considered intersection of strategy, material, motion and technology.',
    challenge: 'Express a multidisciplinary creative practice through one coherent experience. Give every decision a purpose and every interaction a clear direction.',
    direction: 'Obsidian. Electric blue. Titanium. Precision. A controlled palette, an architectural grid and deliberate motion establish the studio’s digital voice.',
    experience: 'Connected scenes, dimensional typography and a responsive 3D object create a continuous journey through the studio’s thinking and capabilities.',
  },
];

export const services = [
  { title: 'Creative direction', tag: 'VISION / ART DIRECTION', description: 'One clear idea, carried through every touchpoint. We connect strategy, storytelling and visual culture to give ambitious brands a distinctive point of view.', items: ['Creative strategy', 'Art direction', 'Campaign concepts'], image: '/media/demir.webp' },
  { title: 'Brand identity', tag: 'STRATEGY / IDENTITY', description: 'We build identities that are recognisable, adaptable and made to last. From positioning to a complete visual system, every choice works towards a shared purpose.', items: ['Brand strategy', 'Corporate identity', 'Design systems'], image: '/media/limon.webp' },
  { title: 'Web design', tag: 'UI / UX / E-COMMERCE', description: 'Immersive digital platforms where strategy, visual storytelling and technology meet. Clear journeys and distinctive interfaces, designed around real people.', items: ['UI / UX design', 'E-commerce design', 'Digital products'], image: '/media/ciger.webp' },
  { title: 'Web development', tag: 'CODE / PERFORMANCE', description: 'Thoughtful engineering turns a strong design into a reliable experience. Responsive, accessible websites built for performance and the people who use them.', items: ['Frontend development', 'E-commerce', 'Interactive platforms'], image: '/media/seyban.webp' },
  { title: 'Social media', tag: 'CONTENT / CULTURE', description: 'A consistent visual voice for an always-moving world. We create content systems that help a brand stay recognisable across formats, channels and moments.', items: ['Content direction', 'Social design', 'Editorial systems'], image: '/media/limon.webp' },
  { title: 'Digital campaigns', tag: 'IDEAS / COMMUNICATION', description: 'Ideas with a reason to exist and a clear audience in mind. We develop creative campaigns that connect an identifiable message with a considered digital execution.', items: ['Digital advertising', 'Creative campaigns', 'Campaign assets'], image: '/media/ciger.webp' },
  { title: 'Motion & 3D', tag: 'MOVEMENT / DIMENSION', description: 'Movement with intention. We use dimensional design, motion systems and interactive 3D to make complex ideas tangible and digital experiences memorable.', items: ['Motion design', '3D web experiences', 'Interactive storytelling'], image: '/media/demir.webp' },
];
