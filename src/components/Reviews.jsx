import React from 'react';
import './Reviews.css';

const Reviews = () => {
  // Placeholder review data. Replace these strings with real customer reviews once you launch!
  const allReviews = [
    {
      id: 1,
      name: "Sumit Kumar",
      role: "Web Developer",
      rating: 5,
      content: "I read this e-book and within weeks I landed a $200 US client for web development using the exact ChatGPT frameworks provided."
    },
    {
      id: 2,
      name: "Manoj Roy",
      role: "Freelancer",
      rating: 5,
      content: "I used the AI lead generation methods from this book. I now get 30 confirmed leads daily, building a solid $500/month side income."
    },
    {
      id: 3,
      name: "Kushal Dana",
      role: "Content Creator",
      rating: 5,
      content: "I increased my Facebook and YouTube followers using the AI content strategies, generating a steady $10 daily passive income."
    },
    {
      id: 4,
      name: "Sanjay Gupta",
      role: "Freelancer",
      rating: 5,
      content: "I read this book and now I make a consistent ₹100 daily just by applying the methods for 2 hours a day. Highly recommended!"
    },
    {
      id: 5,
      name: "Rahul Sharma",
      role: "Freelance Web Developer",
      rating: 5,
      content: "I was looking for a practical way to find international clients. The ideas in this guide helped me understand how to package my website skills and approach businesses. It gave me a much clearer direction for finding US and UK clients."
    },
    {
      id: 6,
      name: "Priya Das",
      role: "Social Media Manager",
      rating: 5,
      content: "Before reading this guide, I knew how to use ChatGPT but didn't know how to turn it into a service. The social media ideas helped me create a proper service offer and start approaching potential clients."
    },
    {
      id: 7,
      name: "Arjun Mehta",
      role: "SEO Freelancer",
      rating: 5,
      content: "The SEO and AI-assisted service ideas gave me several new ways to package my skills. I started using the workflows to create better proposals and outreach messages, and it made my client acquisition process much easier."
    },
    {
      id: 8,
      name: "Sneha Roy",
      role: "YouTube Creator",
      rating: 5,
      content: "The content ideas completely changed the way I plan my videos. I started using AI for research, titles, hooks and content planning. My videos became much more consistent and I started seeing better reach than before."
    },
    {
      id: 9,
      name: "Amit Kumar",
      role: "YouTube & Facebook Creator",
      rating: 5,
      content: "I was struggling to consistently create content for Facebook and YouTube. The guide showed me how to use AI to generate content ideas and build a repeatable workflow. Now I can create much more content in less time."
    },
    {
      id: 10,
      name: "Neha Singh",
      role: "Data Entry Freelancer",
      rating: 5,
      content: "I wanted a simple side-income opportunity that I could do for a few hours a day. The data-entry and freelance service ideas helped me understand how to package my skills and search for potential clients."
    },
    {
      id: 11,
      name: "Saurav Ghosh",
      role: "Graphic Designer",
      rating: 5,
      content: "What I liked most is that the ebook doesn't just give random AI tricks. It shows different ways to turn AI-assisted skills into actual services. I found several ideas that I could combine with my existing design skills."
    },
    {
      id: 12,
      name: "Anjali Verma",
      role: "Digital Marketing Freelancer",
      rating: 5,
      content: "The marketing, content and client-service ideas gave me several new services to offer. I especially liked the starter prompts because they helped me get started much faster."
    },
    {
      id: 13,
      name: "Rohan Patel",
      role: "E-commerce Seller",
      rating: 5,
      content: "I started exploring the AI ideas for product descriptions, customer communication and marketing content. It helped me save time and organize my daily business work much better."
    },
    {
      id: 14,
      name: "Pooja Sen",
      role: "Freelance Content Writer",
      rating: 5,
      content: "This guide helped me think beyond traditional content writing. I found several AI-assisted services that I could add to my existing freelance work and use to create new offers."
    },
    {
      id: 15,
      name: "Vikash Yadav",
      role: "Part-Time Freelancer",
      rating: 5,
      content: "I bought this because I wanted to explore side-income opportunities without making a huge investment. The biggest benefit for me was having so many ideas in one place. It helped me choose one direction and start testing it."
    }
  ];

  // Split into two rows for the marquee
  const row1 = allReviews.slice(0, 7);
  const row2 = allReviews.slice(7, 15);

  const renderStars = (count) => {
    return Array.from({ length: count }).map((_, i) => (
      <svg key={i} className="star-icon" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ));
  };

  const ReviewCard = ({ review }) => (
    <div className="review-card glass-card">
      <div className="review-stars mb-3">
        {renderStars(review.rating)}
      </div>
      <p className="review-content mb-4">
        "{review.content}"
      </p>
      <div className="review-author">
        <div className="author-avatar">
          {review.name.replace('[', '').charAt(0) || "U"}
        </div>
        <div className="author-details">
          <div className="author-name">{review.name}</div>
          <div className="author-role">{review.role}</div>
        </div>
        <div className="verified-badge" title="Verified Buyer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <section className="section section-dark reviews-section" id="reviews">
      <div className="container">
        <div className="text-center reveal mb-5">
          <div className="section-label section-label-dark">READER FEEDBACK</div>
          <h2 className="h2 mb-3">What Early Readers <span className="text-gradient">Are Saying</span></h2>
          <p className="subtitle mx-auto">
            Join the freelancers and creators who are already using these frameworks.
          </p>
        </div>
      </div>

      {/* Marquee Wrapper */}
      <div className="marquee-container reveal">
        <div className="marquee-track marquee-left">
          {/* Duplicate row content to ensure seamless infinite scroll */}
          {[...row1, ...row1].map((review, i) => (
            <ReviewCard key={`r1-${i}`} review={review} />
          ))}
        </div>
        
        <div className="marquee-track marquee-right mt-4">
          {[...row2, ...row2].map((review, i) => (
            <ReviewCard key={`r2-${i}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
