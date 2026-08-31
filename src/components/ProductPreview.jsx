import React from 'react';
import './ProductPreview.css';

const ProductPreview = () => {
  const previews = [
    {
      id: 1,
      title: "Category Breakdown",
      desc: "Detailed table of contents mapping out all 25 income categories.",
      mockupType: "list"
    },
    {
      id: 2,
      title: "Idea Directory",
      desc: "500 specific, actionable ideas structured for easy browsing.",
      mockupType: "grid"
    },
    {
      id: 3,
      title: "AI Workflows",
      desc: "Step-by-step execution plans for the most profitable services.",
      mockupType: "flow"
    },
    {
      id: 4,
      title: "Starter Prompts",
      desc: "Copy-paste prompts to immediately generate professional results.",
      mockupType: "code"
    },
    {
      id: 5,
      title: "Launch Plan",
      desc: "A realistic 7-day roadmap to start offering your chosen service.",
      mockupType: "timeline"
    }
  ];

  return (
    <section className="section section-dark preview-section">
      <div className="container">
        <div className="text-center reveal mb-5">
          <div className="section-label section-label-dark">SNEAK PEEK</div>
          <h2 className="h2 mb-3">TAKE A LOOK INSIDE</h2>
          <p className="subtitle mx-auto" style={{ maxWidth: '600px' }}>
            A premium digital guide designed for immediate execution, not just passive reading.
          </p>
        </div>

        <div className="preview-gallery reveal">
          {previews.map((preview) => (
            <div key={preview.id} className="preview-card">
              <div className="preview-mockup-wrapper">
                <div className={`mockup-content type-${preview.mockupType}`}>
                  {/* CSS-based mockups to look like book pages */}
                  <div className="mockup-header"></div>
                  <div className="mockup-body">
                    <div className="mockup-line"></div>
                    <div className="mockup-line short"></div>
                    <div className="mockup-box"></div>
                    <div className="mockup-line"></div>
                    <div className="mockup-line"></div>
                  </div>
                </div>
              </div>
              <div className="preview-info">
                <h4>{preview.title}</h4>
                <p>{preview.desc}</p>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default ProductPreview;
