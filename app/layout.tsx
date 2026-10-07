import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Intro from '@/components/Intro';
import MotionDirector from '@/components/MotionDirector';
import { assetPath } from '@/lib/site';
import './globals.css';
import './interior.css';

export const metadata: Metadata = {
  title: { default: 'Demir Digital® — Design. Technology. Impact.', template: '%s — Demir Digital®' },
  description: 'An independent creative agency in Ordu, Türkiye. Distinctive brands, digital products and immersive web experiences.',
  icons: { icon: assetPath('/favicon.svg') },
  openGraph: { title: 'Demir Digital — Creative Agency', description: 'Obsidian. Electric blue. Titanium. A new perspective on digital.', type: 'website' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body id="top"><a className="skip-link" href="#main">Skip to content</a><Intro /><Header /><div id="page-content"><div id="main">{children}</div><Footer /></div><MotionDirector /></body></html>;
}
