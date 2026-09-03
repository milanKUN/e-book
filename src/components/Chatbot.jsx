import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import { config } from '../config';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  // Exact Script and Logic provided by user
  const chatLogic = {
    welcome: {
      text: `Hi! 👋 I’m the AI Assistant for ${config.COMPANY_NAME}.\n\nI can help you understand the ${config.PRODUCT_NAME}, what’s inside, how it works, languages, payment, delivery and the different AI income opportunities covered in the guide.\n\nWhat would you like to know?`,
      options: [
        "💰 Can I really earn from this?",
        "📘 What exactly is inside the ebook?",
        "🌐 Which languages are available?",
        "🔄 See more questions..."
      ]
    },
    responses: {
      "🔄 See more questions...": {
        text: "Here are some other common questions you can ask me:",
        followUps: [
          "💳 What if my payment fails?",
          "📱 Can beginners use this?",
          "💻 Do I need coding skills?",
          "🔄 See even more..."
        ]
      },
      "🔄 See even more...": {
        text: "And a few more topics we can cover:",
        followUps: [
          "🚀 How can I start earning?",
          "📦 How will I receive the ebook?",
          "💵 Why is it only ₹99?",
          "🔐 Is payment secure?"
        ]
      },
      "💰 Can I really earn from this?": {
        text: "Yes — the guide is designed around practical ways to use ChatGPT and AI to create useful services, digital products and freelance opportunities.\n\nBut the important part is what you do after reading it.\n\nThe ebook gives you ideas, workflows and practical directions. If you choose an idea that matches your skills, learn it properly, create a useful offer and consistently work on finding customers, there can be real earning opportunities.\n\nThink of the ebook as a roadmap — not a magic-income button. 💚\n\nYour result will depend on your skills, execution, customer demand, pricing and consistency.",
        followUps: ["🚀 How can I start earning?", "📘 What exactly is inside the ebook?", "📱 Can beginners use this?", "👉 GET THE GUIDE — ₹99"]
      },
      "📘 What exactly is inside the ebook?": {
        text: "You get a complete collection of 500 practical AI income ideas across 25 categories.\n\nInside you'll find ideas around:\n\n• Freelancing\n• AI services\n• Content creation\n• Social media\n• SEO\n• Websites\n• Digital products\n• E-commerce\n• YouTube\n• Small-business services\n• Data-entry opportunities\n• Automation\n• Research\n• Customer support\n• Marketing\n• And many more.\n\nYou also get practical workflows, starter prompts, monetization approaches and a 7-day action plan.\n\nThe goal is not just to give you 500 ideas — it's to help you choose one and actually start working on it.",
        followUps: ["What kind of income ideas are included?", "Can I use these ideas for freelancing?", "👉 GET THE GUIDE — ₹99"]
      },
      "🌐 Which languages are available?": {
        text: "Currently, the available version is English.\n\nHindi and Bengali versions can be added when they are officially available.",
        followUps: ["📦 How will I receive the ebook?", "👉 GET THE GUIDE — ₹99"]
      },
      "💳 What if my payment fails?": {
        text: "No worries. 😊\n\nIf your payment fails:\n\n1. Check whether the amount was actually deducted.\n2. If the amount was NOT deducted, simply try the payment again.\n3. If the amount WAS deducted but your ebook wasn't delivered, don't make another payment immediately.\n4. Contact support with your payment/order details so the transaction can be checked.\n\nSupport:\nWhatsApp: " + config.WHATSAPP_NUMBER + "\nEmail: " + config.EMAIL + "\n\nIf payment is successfully confirmed, the ebook delivery process will begin according to the configured payment system.",
        followUps: ["🔐 Is payment secure?", "What happens after payment?"]
      },
      "📱 Can beginners use this?": {
        text: "Absolutely. 👍\n\nThe guide is designed to be beginner-friendly.\n\nYou don't need to understand everything about AI before starting.\n\nA simple approach is:\n\nChoose one idea\n↓\nLearn the workflow\n↓\nCreate a sample\n↓\nCreate an offer\n↓\nFind potential customers\n↓\nImprove based on feedback\n\nYou can start small and build your skills as you go.",
        followUps: ["💻 Do I need coding skills?", "🚀 How can I start earning?", "👉 GET THE GUIDE — ₹99"]
      },
      "💻 Do I need coding skills?": {
        text: "No, not for most of the ideas.\n\nMany opportunities covered in the guide involve content, research, social media, digital products, customer support, marketing, freelancing and other AI-assisted services.\n\nSome technical ideas may require additional skills, but you can simply choose opportunities that match your current ability.",
        followUps: ["📱 Can beginners use this?", "Can I use these ideas for freelancing?"]
      },
      "🚀 How can I start earning?": {
        text: "The best way is not to try all 500 ideas at once.\n\nStart with ONE.\n\nFor example:\n\n1. Choose a service you understand.\n2. Use ChatGPT to help you build a sample.\n3. Create a simple service package.\n4. Find businesses or customers who need that result.\n5. Send personalized offers.\n6. Deliver high-quality work.\n7. Improve your process and repeat.\n\nFor example, someone with website skills could explore AI-assisted website services.\nSomeone interested in social media could explore content and social-media management.\nSomeone with basic computer skills could explore suitable support or data-entry services.\n\nThe guide gives you many directions so you can find the one that fits you.",
        followUps: ["How much can I earn?", "Can I find international clients?", "👉 GET THE GUIDE — ₹99"]
      },
      "📦 How will I receive the ebook?": {
        text: "It's a digital ebook, so there is no physical delivery.\n\nAfter successful payment, the ebook can be delivered digitally through the configured delivery system.\n\nYou can then read it on your:\n\n📱 Smartphone\n💻 Laptop\n🖥️ Desktop\n📖 Tablet\n\nYou don't need to wait for courier delivery.",
        followUps: ["Is this a physical book?", "Can I read it on mobile?", "👉 GET THE GUIDE — ₹99"]
      },
      "💵 Why is it only ₹99?": {
        text: "The ₹99 price is being offered as an introductory/accessible digital-product price.\n\nThe idea is to make the guide affordable for people who want to explore AI income opportunities without making a large initial investment.\n\nFor ₹99, you get access to:\n\n✓ 500 practical ideas\n✓ 25 categories\n✓ AI workflows\n✓ Starter prompts\n✓ Monetization ideas\n✓ 7-day action plan\n✓ Outreach guidance\n✓ Pricing guidance\n\nThe real value comes from how you use the information.",
        followUps: ["💰 Can I really earn from this?", "👉 GET THE GUIDE — ₹99"]
      },
      "🔐 Is payment secure?": {
        text: "Payment security depends on the payment provider used at checkout.\n\nWe don't ask you to send your card details or payment credentials through this chatbot.\n\nPlease complete your payment only through the official checkout/payment link provided on the website.",
        followUps: ["💳 What if my payment fails?", "👉 GET THE GUIDE — ₹99"]
      },
      // Additional requested questions
      "How much can I earn?": {
        text: "There isn't one fixed amount.\n\nYour earning potential depends on:\n\n• What service you choose\n• Your skill level\n• Your pricing\n• Customer demand\n• Number of customers\n• Quality of your work\n• How consistently you market yourself\n\nFor example, one person may use the guide to build a small freelance service, while another may use it to develop a digital product or content business.\n\nThe guide gives you opportunities and frameworks — your execution determines the result.",
        followUps: ["Can I find international clients?", "Can I use this for a side income?", "👉 GET THE GUIDE — ₹99"]
      },
      "Can I find international clients?": {
        text: "Yes, international clients can be one possible direction.\n\nFor example, people with skills in:\n\n• Website development\n• SEO\n• Social media management\n• Content\n• Design\n• Virtual assistance\n• Research\n• Customer support\n\ncan explore international freelance opportunities.\n\nHowever, getting international clients is not automatic. You'll need a good offer, portfolio/sample work, communication, outreach and consistent effort.",
        followUps: ["How much can I earn?", "Can I use these ideas for freelancing?"]
      },
      "Can I use this for YouTube?": {
        text: "Yes. 👍\n\nThe guide includes AI-assisted content opportunities that can be useful for YouTube creators.\n\nChatGPT can help with:\n\n• Video ideas\n• Content planning\n• Hooks\n• Titles\n• Descriptions\n• Scripts\n• Research structure\n• Content calendars\n\nBut AI alone doesn't guarantee views or income. Your topic, content quality, consistency, audience and platform performance still matter.",
        followUps: ["Can I use this for Facebook content?", "What kind of income ideas are included?"]
      },
      "Can I use this for Facebook content?": {
        text: "Yes.\n\nYou can explore AI-assisted Facebook content workflows such as:\n\n• Post ideas\n• Captions\n• Content calendars\n• Promotional content\n• Audience research\n• Video concepts\n• Engagement ideas\n\nThe guide can help you build a more consistent content workflow.\n\nActual reach, followers and income depend on your content, audience and execution.",
        followUps: ["Can I use this for YouTube?", "What kind of income ideas are included?"]
      },
      "Can I use this for SEO services?": {
        text: "Yes.\n\nThe guide includes AI-assisted opportunities that can complement SEO work.\n\nChatGPT can help with:\n\n• Keyword research structures\n• Content briefs\n• Topic clusters\n• Meta descriptions\n• Content outlines\n• SEO checklists\n• Client reporting\n\nYou should always verify SEO information and perform proper research before delivering work to a client.",
        followUps: ["Can I offer website services?", "Can I find international clients?"]
      },
      "Can I find data-entry work?": {
        text: "Yes, data-entry and administrative support can be explored as one type of freelance opportunity.\n\nThe important thing is to find legitimate clients and clearly understand the work, payment terms and requirements before starting.\n\nNever pay a suspicious person simply because they promise guaranteed data-entry income.",
        followUps: ["Can I use this for a side income?", "Can beginners use this?"]
      },
      "Can I use this for a side income?": {
        text: "Yes. Many of the ideas can be explored as side-income opportunities.\n\nYou can start with a few hours per day and gradually increase your skills, customers and workload.\n\nThe key is choosing something realistic for your current skills and available time.",
        followUps: ["How much can I earn?", "Can I find international clients?", "👉 GET THE GUIDE — ₹99"]
      },
      "How many pages is it?": {
        text: "The exact page count can vary by edition/version.\n\nIf you want the exact current page count, use the product information configured by the website.",
        followUps: ["What exactly is inside the ebook?", "👉 GET THE GUIDE — ₹99"]
      },
      "Is this a physical book?": {
        text: "No. It is a digital eBook.\n\nYou can read it on your smartphone, laptop, desktop or tablet.",
        followUps: ["Can I read it on mobile?", "📦 How will I receive the ebook?"]
      },
      "Can I read it on mobile?": {
        text: "No. It is a digital eBook.\n\nYou can read it on your smartphone, laptop, desktop or tablet.",
        followUps: ["Is this a physical book?", "📦 How will I receive the ebook?"]
      },
      "What happens after payment?": {
        text: "Once your payment is successfully confirmed, your order is processed through the configured delivery system.\n\nYou will receive access according to the delivery method used on the website.\n\nIf you complete payment but don't receive the ebook, contact support with your order/payment details.",
        followUps: ["💳 What if my payment fails?", "👉 GET THE GUIDE — ₹99"]
      },
      "Can I get a refund?": {
        text: "Refund eligibility depends on the refund policy shown on the checkout/website.\n\nPlease check the Refund Policy before purchasing.\n\nIf you have a payment or delivery issue, contact support and we'll help you understand the next step.",
        followUps: ["💳 What if my payment fails?", "What happens after payment?"]
      },
      "👉 GET THE GUIDE — ₹99": {
        text: "Absolutely! 🚀\n\nYou can get the ChatGPT Income Guide here:\n\n👉 <button id='chatbot-checkout-btn' class='btn btn-primary' style='border:none; cursor:pointer;'>Click here to purchase securely</button>\n\nCurrent price: ₹" + config.PRODUCT_PRICE + "\n\nAfter successful payment, you'll receive digital access.",
        followUps: ["What happens after payment?", "💳 What if my payment fails?"]
      },
      // Fallback aliases mapping exactly to script if they aren't explicitly typed above
      "What kind of income ideas are included?": {
        text: "You get a complete collection of 500 practical AI income ideas across 25 categories.\n\nInside you'll find ideas around:\n• Freelancing\n• AI services\n• Content creation\n• Social media\n• SEO\n• Websites\n• Digital products\n• E-commerce\n• YouTube\n• Small-business services\n• Data-entry opportunities\n• Automation\n• Research\n• Customer support\n• Marketing\n• And many more.",
        followUps: ["📘 What exactly is inside the ebook?", "👉 GET THE GUIDE — ₹99"]
      },
      "Can I use these ideas for freelancing?": {
        text: "Absolutely. The guide includes specific sections for freelancers looking to add AI-assisted services to their offers.\n\nIt covers everything from writing to marketing to virtual assistance.",
        followUps: ["Can I find international clients?", "🚀 How can I start earning?"]
      },
      "Can I offer website services?": {
        text: "Yes! There are specific ideas related to website creation, no-code tools, and offering AI-assisted website services to clients.",
        followUps: ["Can I use this for SEO services?", "👉 GET THE GUIDE — ₹99"]
      },
      "Do I get lifetime access?": {
        text: "Yes, once you download the digital ebook, you have lifetime access to the file on your device.",
        followUps: ["Is this a physical book?", "👉 GET THE GUIDE — ₹99"]
      },
      "Can I buy it for someone else?": {
        text: "Yes, you can simply forward the downloaded PDF to them, or enter their email address during checkout so they receive the download link directly.",
        followUps: ["👉 GET THE GUIDE — ₹99"]
      }
    }
  };

  // Initialize chat when opened for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { type: 'bot', text: chatLogic.welcome.text, options: chatLogic.welcome.options }
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle dynamic checkout button clicks inside dangerouslySetInnerHTML
  useEffect(() => {
    const handleDynamicClick = (e) => {
      if (e.target && e.target.id === 'chatbot-checkout-btn') {
        e.preventDefault();
        window.dispatchEvent(new Event('open-checkout'));
      }
    };
    document.addEventListener('click', handleDynamicClick);
    return () => document.removeEventListener('click', handleDynamicClick);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    
    if (val.trim().length > 1) {
      const allQuestions = Object.keys(chatLogic.responses).filter(q => 
        !q.includes("See more") && 
        !q.includes("See even more") && 
        !q.includes("GET THE GUIDE")
      );
      
      const matches = allQuestions.filter(q => 
        q.toLowerCase().includes(val.toLowerCase())
      );
      
      setSuggestions(matches.slice(0, 3));
    } else {
      setSuggestions([]);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const val = inputValue.trim();
    setInputValue("");
    setSuggestions([]);
    handleOptionClick(val);
  };

  const handleOptionClick = (questionText) => {
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: questionText }]);
    
    // Simulate typing delay
    setIsTyping(true);
    
    setTimeout(() => {
      const response = chatLogic.responses[questionText];
      
      // If we don't have a specific response, give a smart fallback
      if (!response) {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: "If you feel the guide matches what you're looking for, you can start with the ₹99 edition.\n\nYou don't need to use all 500 ideas.\n\nFind one idea that fits you, learn it, apply it and test it.", 
          options: ["👉 GET THE GUIDE — ₹99"] 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: response.text, 
          options: response.followUps 
        }]);
      }
      setIsTyping(false);
    }, 600); // 600ms typing delay for realism
  };

  const renderTextWithHTML = (text) => {
    // Basic conversion of \n to <br/> and handling the anchor tag in the checkout response
    return text.split('\n').map((str, index, array) => (
      <React.Fragment key={index}>
        <span dangerouslySetInnerHTML={{ __html: str }} />
        {index === array.length - 1 ? null : <br />}
      </React.Fragment>
    ));
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className={`chatbot-fab ${isOpen ? 'hidden' : ''}`} 
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Assistant"
        style={{ padding: 0, overflow: 'hidden' }}
      >
        <img src="/bot-avatar.png" alt="AI Assistant" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-left">
            <div className="chatbot-avatar">
              <img src="/bot-avatar.png" alt="Assistant Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            <div className="chatbot-title-area">
              <h3 className="chatbot-name">{config.COMPANY_NAME} Assistant</h3>
              <div className="chatbot-status">
                <span className="status-dot"></span> Online
              </div>
            </div>
          </div>
          <button className="chatbot-close" onClick={() => setIsOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="chatbot-header-subtitle">
          Ask me anything about the guide
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.type}`}>
              {msg.type === 'bot' && (
                <div className="message-avatar-small">
                  <img src="/bot-avatar.png" alt="Assistant Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
              )}
              <div className={`message-bubble ${msg.type}`}>
                {renderTextWithHTML(msg.text)}
              </div>
              
              {/* Render options ONLY for the most recent bot message */}
              {msg.type === 'bot' && index === messages.length - 1 && msg.options && !isTyping && (
                <div className="message-options">
                  {msg.options.map((option, i) => (
                    <button 
                      key={i} 
                      className={`option-pill ${option.includes('GET THE GUIDE') ? 'option-primary' : ''}`}
                      onClick={() => handleOptionClick(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="message-wrapper bot typing">
              <div className="message-avatar-small">
                 <img src="/bot-avatar.png" alt="Assistant Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <div className="message-bubble bot typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area & Suggestions */}
        <div className="chatbot-input-container">
          {suggestions.length > 0 && (
            <div className="chatbot-suggestions">
              {suggestions.map((s, idx) => (
                <div key={idx} className="suggestion-item" onClick={() => {
                  setInputValue('');
                  setSuggestions([]);
                  handleOptionClick(s);
                }}>
                  {s}
                </div>
              ))}
            </div>
          )}
          
          <form className="chatbot-input-area" onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}>
            <input 
              type="text" 
              className="chatbot-input" 
              placeholder="Type your question..." 
              value={inputValue}
              onChange={handleInputChange}
            />
            <button type="submit" className="chatbot-send-btn" disabled={!inputValue.trim()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 18, height: 18}}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
