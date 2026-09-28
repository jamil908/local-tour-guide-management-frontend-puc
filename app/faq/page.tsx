/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: 'booking' | 'guides' | 'payment' | 'general';
}

const faqData: FAQItem[] = [
  {
    id: 1,
    category: 'booking',
    question: 'How do I book a tour?',
    answer: 'Simply browse our tours, select one that interests you, choose your preferred date, and click "Book Now". Fill in your details and proceed to payment. You\'ll receive a confirmation email with all the tour details and guide information.',
  },
  {
    id: 2,
    category: 'booking',
    question: 'Can I cancel or reschedule my booking?',
    answer: 'Yes, you can cancel up to 48 hours before the tour for a full refund. To reschedule, contact your guide directly through the messaging feature in your booking. Most guides are flexible and happy to accommodate date changes.',
  },
  {
    id: 3,
    category: 'booking',
    question: 'What is your cancellation policy?',
    answer: 'We offer a full refund if you cancel 48 hours before the tour. Cancellations within 48 hours will be charged a 50% cancellation fee. Tours cancelled by the guide receive a full refund.',
  },
  {
    id: 4,
    category: 'guides',
    question: 'How can I become a local guide?',
    answer: 'Click on "Become a Guide" in the navigation. Fill out your profile with your experience and expertise. After verification of your background and credentials, you\'ll be able to create and manage your own tours.',
  },
  {
    id: 5,
    category: 'guides',
    question: 'What do guides earn per tour?',
    answer: 'Guides keep 80% of the tour fee, with LocalGuide taking 20% as a service fee. Payment is processed weekly to your bank account. There\'s no minimum earning requirement.',
  },
  {
    id: 6,
    category: 'guides',
    question: 'Do I need any certifications to be a guide?',
    answer: 'While certifications are not mandatory, they can help your profile stand out. We accept tourism licenses, language certificates, and industry-specific credentials. Experience and positive reviews are equally valued.',
  },
  {
    id: 7,
    category: 'payment',
    question: 'What payment methods are accepted?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and local payment methods depending on your location including Apple Pay and Google Pay.',
  },
  {
    id: 8,
    category: 'payment',
    question: 'Is my payment information secure?',
    answer: 'Yes, we use industry-standard SSL encryption and PCI-DSS compliance to protect all payment information. Your credit card details are never stored on our servers. All transactions are processed through secure gateways.',
  },
  {
    id: 9,
    category: 'payment',
    question: 'When will I receive my refund?',
    answer: 'Refunds are processed within 5-7 business days after cancellation approval. The money will be credited back to the original payment method used during booking.',
  },
  {
    id: 10,
    category: 'general',
    question: 'What if I have a problem during the tour?',
    answer: 'Contact us immediately through the app chat or call our 24/7 support team at +1 (555) 123-4567. We\'ll help resolve any issues and ensure you have a great experience. Your satisfaction is our priority.',
  },
  {
    id: 11,
    category: 'general',
    question: 'Are tours available for private groups?',
    answer: 'Yes! Most guides offer private group options. When booking, select the group size and message the guide to arrange a private tour. Private tours can be customized to your preferences.',
  },
  {
    id: 12,
    category: 'general',
    question: 'Can I leave reviews for guides?',
    answer: 'Absolutely! After completing a tour, you\'ll be able to leave a rating and detailed review. Your feedback helps other travelers and helps guides improve their services. Reviews are published within 48 hours.',
  },
];

const categories = ['all', 'booking', 'guides', 'payment', 'general'];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredFAQs =
    selectedCategory === 'all'
      ? faqData
      : faqData.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="mr-4"
            >
              <FiHelpCircle className="text-amber-600" size={40} />
            </motion.div>
            <h1 className="text-5xl font-extrabold text-white">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-xl text-gray-400">
            Find answers to common questions about booking tours, becoming a guide, payments, and more.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setExpandedId(null);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 capitalize ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-gray-900 shadow-lg shadow-amber-600/50 scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 hover:border-amber-600/30'
              }`}
            >
              {cat === 'all' ? 'All Topics' : cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Search Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <p className="text-gray-400">
            Showing <span className="text-amber-400 font-bold">{filteredFAQs.length}</span> frequently asked questions
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <motion.button
                  onClick={() =>
                    setExpandedId(expandedId === faq.id ? null : faq.id)
                  }
                  whileHover={{ scale: 1.01 }}
                  className="w-full bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-amber-600/50 rounded-xl p-6 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors flex-1 pr-4">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: expandedId === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-4 flex-shrink-0"
                    >
                      <FiChevronDown
                        className="text-amber-600 group-hover:text-amber-500"
                        size={24}
                      />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {expandedId === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-700"
                      >
                        <p className="text-gray-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Still have questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-gray-800 to-gray-800 border border-amber-600/30 rounded-2xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-400 mb-6">
              Our support team is here to help you 24/7. We're just a message away!
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-amber-600 text-gray-900 rounded-full font-bold hover:bg-amber-500 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/50 hover:scale-105"
            >
              Contact Support
            </a>
          </motion.div>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-amber-600/5 border border-amber-600/20 rounded-xl p-6"
        >
          <h4 className="text-lg font-bold text-amber-400 mb-4">💡 Quick Tips</h4>
          <ul className="space-y-2 text-gray-400">
            <li>• Always read tour descriptions carefully before booking</li>
            <li>• Message your guide in advance if you have special requirements</li>
            <li>• Arrive 10-15 minutes early for better experience</li>
            <li>• Leave reviews to help other travelers choose the best tours</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}