import React from 'react';
import Hero from '@/components/Hero';
import TrustStrip from '@/components/TrustStrip';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedProducts from '@/components/FeaturedProducts';
import WholesaleIntro from '@/components/WholesaleIntro';
import WhyEnquire from '@/components/WhyEnquire';
import HowItWorks from '@/components/HowItWorks';
import FaqAccordion from '@/components/FaqAccordion';
import FinalCta from '@/components/FinalCta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryGrid />
      <FeaturedProducts />
      <WholesaleIntro />
      <WhyEnquire />
      <HowItWorks />
      <FaqAccordion />
      <FinalCta />
    </>
  );
}
