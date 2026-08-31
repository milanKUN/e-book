import React from 'react';
import './CategoriesGrid.css';

const CategoriesGrid = () => {
  const categories = [
    "AI Content & Copywriting",
    "Freelancing Services",
    "Social Media Services",
    "Design & Creative Support",
    "Digital Products",
    "Education & Learning",
    "Career & Job Services",
    "Small Business Support",
    "Marketing & Sales",
    "E-commerce",
    "YouTube & Video",
    "Blogging & SEO",
    "Local Business Growth",
    "Photography & Creative Businesses",
    "Real Estate",
    "Finance & Business Education",
    "Productivity & Automation",
    "Customer Service",
    "Web & No-Code Support",
    "Entrepreneurship",
    "AI-Assisted Research",
    "Freelancer & Creator Growth",
    "Lifestyle & Personal Services",
    "AI Prompt & Automation",
    "Business Templates & Operations"
  ];

  return (
    <section className="section bg-light categories-section" id="categories">
      <div className="container">
        <div className="text-center reveal">
          <div className="section-label">THE IDEA LIBRARY</div>
          <h2 className="h2 mb-4">
            500 Ideas. 25 Categories.{' '}
            <span className="text-emerald">Countless Directions to Explore.</span>
          </h2>
          <p className="subtitle mx-auto mb-5" style={{ maxWidth: '600px' }}>
            Find the perfect intersection between your existing interests and what businesses are actively paying for right now.
          </p>
        </div>

        <div className="category-tags reveal">
          {categories.map((category, index) => (
            <div key={index} className="category-tag">
              <span className="category-dot"></span>
              {category}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;
