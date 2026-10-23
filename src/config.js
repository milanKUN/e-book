export const config = {
  // Brand & Product
  COMPANY_NAME: "GURU NETRA",
  PRODUCT_NAME: "ChatGPT Income Guide",
  PRODUCT_SUBTITLE: "500 Practical AI Income Ideas",
  COVER_IMAGE: "/ebook-cover.jpg",

  // Pricing — FALLBACK ONLY. The live price is managed in the admin panel
  // (Settings page) and loaded at runtime via GET /api/settings (usePricing hook).
  PRODUCT_PRICE: "1",
  ORIGINAL_PRICE: "999",

  // Payment Configuration (CodeIgniter 4 backend)
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "/api",
  CREATE_ORDER_ENDPOINT: (import.meta.env.VITE_API_BASE_URL || "/api") + "/payments/create-order",
  VERIFY_PAYMENT_ENDPOINT: (import.meta.env.VITE_API_BASE_URL || "/api") + "/payments/verify",
  PAYMENT_STATUS_ENDPOINT: (import.meta.env.VITE_API_BASE_URL || "/api") + "/payments/status",
  EBOOK_DOWNLOAD_ENDPOINT: (import.meta.env.VITE_API_BASE_URL || "/api") + "/payments/download",

  // Razorpay (public key id only — secret stays on the server)
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TrNBb4yXJwFrNF",
  RAZORPAY_CHECKOUT_URL: "https://checkout.razorpay.com/v1/checkout.js",

  THANK_YOU_URL: "",
  EBOOK_DOWNLOAD_URL: "",

  // Contact (Empty strings hide them in the footer)
  PHONE_NUMBER: "+919735659798",
  WHATSAPP_NUMBER: "+919735659798",
  EMAIL: "gurunetra@gmail.com",
  ADDRESS: "Vill:- Amdangra , po:-Sabrakone, Dist:-Bankura , pin:-722149", // IMPORTANT: Must be updated before Cashfree whitelisting

  // Sales Counter System
  SHOW_REAL_SALES_COUNTER: false,
  REAL_SALES_COUNT: 0, // Fallback if API fails or is not connected

  // Social Proof (Empty array shows "Be Among Our First Readers" fallback)
  TESTIMONIALS: [],

  // FAQ Data
  FAQ: [
    {
      question: "What is inside the ebook?",
      answer: "The ebook contains 500 practical ideas across 25 categories, complete with workflows, monetization models, and a 7-day launch plan."
    },
    {
      question: "Is this suitable for beginners?",
      answer: "Yes, it is beginner friendly. It provides step-by-step guidance on how to start small and grow your AI income opportunities."
    },
    {
      question: "Do I need coding knowledge?",
      answer: "No coding knowledge is required. The guide focuses on using AI tools effectively for services and digital products."
    },
    {
      question: "Is the ebook in English?",
      answer: "Yes, the entire guide is written in clear, accessible English."
    },
    {
      question: "How will I receive the ebook?",
      answer: "You will get instant digital access with a direct download link immediately after purchase."
    },
    {
      question: "Can I use these ideas for freelancing?",
      answer: "Absolutely. The guide includes specific sections for freelancers looking to add AI-assisted services to their offers."
    },
    {
      question: "Can I use ChatGPT for these methods?",
      answer: "Yes, the methods are designed around practical uses of ChatGPT and other accessible AI tools."
    },
    {
      question: "Can I really earn money by watching ads?",
      answer: "Yes. The guide includes a dedicated method on earning from watching ads — it teaches you which genuine platforms actually pay, how to avoid scams, and simple daily routines people use to build a steady side income from their phone."
    },
    {
      question: "Can I earn income while chatting with ChatGPT?",
      answer: "Absolutely. Most people only chat with ChatGPT for fun. This guide shows you the real ways to turn those conversations into paid work — such as paid AI training tasks, AI-powered chat support for businesses, and chat-based freelance services you can offer."
    },
    {
      question: "Is income guaranteed?",
      answer: "Yes — you can turn these ideas into real income opportunities when you learn them properly and take action. 🚀\n\nThis guide gives you 500 practical AI income ideas. Choose the ones that match your skills, learn the process, create your service or product, and start finding customers."
    },
    {
      question: "Is this a physical book?",
      answer: "No, this is a digital ebook. You get lifetime access to the purchased digital file."
    },
    {
      question: "How quickly will I receive the ebook?",
      answer: "Delivery is instant upon successful payment."
    }
  ]
};
