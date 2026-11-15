'use client';

import React from 'react';
import { Star } from 'lucide-react';
import StyleHubSectionHeader from './StyleHubSectionHeader';

interface Review {
  id: string;
  author: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
}

const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Ananya Sharma',
    role: 'Creative Director',
    location: 'Oceana Boutique, London (UK)',
    quote:
      'Wastram has transformed our seasonal resort edit. The drape of their pure modal silk and accuracy of Sanganeri handblocks are unmatched by any factory in South Asia.',
    rating: 5,
  },
  {
    id: 'rev-2',
    author: 'Priya Mehra',
    role: 'Founder & Head Buyer',
    location: 'Saffron Silk Lounge, New York (USA)',
    quote:
      'Direct atelier WhatsApp coordination made sourcing seamless. Production timelines were maintained down to the hour, and air freight customs was handled end-to-end.',
    rating: 5,
  },
  {
    id: 'rev-3',
    author: 'Sunita Singhania',
    role: 'Multi-Store Proprietor',
    location: 'Veda Heritage, Mumbai & Dubai',
    quote:
      'We have reordered their umbrella dresses and coordinated sets over 8 times this year. Outstanding colorfastness and zero stitching defects across 400+ units.',
    rating: 5,
  },
];

export default function StyleHubReviews() {
  return (
    <section className="container-x mt-24 md:mt-32">
      <StyleHubSectionHeader
        eyebrow="Reviews & Patrons"
        title="Words from our patrons"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((review) => (
          <div
            key={review.id}
            className="border border-[#DEE2E6] dark:border-white/10 p-8 bg-card flex flex-col justify-between hover:border-[#0B2D7F]/40 dark:hover:border-[#D4AF37]/50 hover:shadow-cardHover transition-all duration-300"
            data-testid={`testimonial-${review.id}`}
          >
            <div>
              {/* 5 Stars */}
              <div className="flex items-center gap-1 text-foreground mb-5">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-current text-[#D4AF37]"
                    strokeWidth={1}
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-jost text-base md:text-lg leading-relaxed text-[#171717] dark:text-foreground/90 font-light italic">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
            </div>

            <div className="mt-8 pt-6 border-t border-[#DEE2E6] dark:border-white/10">
              <div className="font-jost font-medium text-base text-[#171717] dark:text-foreground">
                {review.author}
              </div>
              <div className="mt-0.5 text-xs text-[#404040] dark:text-foreground/60 font-body">
                {review.role} · {review.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
