/* eslint-disable react/no-unescaped-entities */
// app/contact/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email',
      value: 'support@localguide.com',
      description: 'We\'ll respond within 24 hours',
    },
    {
      icon: FiPhone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri, 9AM-6PM EST',
    },
    {
      icon: FiMapPin,
      title: 'Office',
      value: '123 Travel Street, NYC',
      description: 'New York, United States',
    },
    {
      icon: FiClock,
      title: 'Support Hours',
      value: '24/7 Support',
      description: 'Always available online',
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container-custom">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-extrabold mb-4 text-amber-500">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-400">
              Have questions about LocalGuide? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, idx) => (
              <motion.div
                key={idx}
                className="p-6 rounded-xl bg-gray-800 border border-gray-700 hover:border-amber-600 hover:shadow-lg hover:shadow-amber-600/20 transition-all duration-300 text-center"
                {...fadeInUp}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              >
                <motion.div
                  className="inline-block p-3 rounded-lg bg-amber-600/20 mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <info.icon className="text-amber-600" size={28} />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-white">{info.title}</h3>
                <p className="text-amber-500 font-semibold mb-1">{info.value}</p>
                <p className="text-gray-500 text-sm">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-white">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FiUser className="inline mr-2" size={16} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FiMail className="inline mr-2" size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-amber-600 transition-colors"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="booking">Booking Support</option>
                    <option value="guide">Guide Application</option>
                    <option value="bug">Report a Bug</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 transition-colors"
                    placeholder="How can we help?"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-amber-600 text-gray-900 rounded-lg font-bold text-lg hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiSend size={20} />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            </motion.div>

            {/* Info & Image */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Illustration */}
              <div className="rounded-xl overflow-hidden border border-gray-700 h-80">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                  alt="Team collaboration"
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
              </div>

              {/* Response Time Info */}
              <motion.div
                className="p-6 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 border border-amber-600/30"
                whileHover={{ borderColor: 'rgba(217, 119, 6, 0.6)' }}
              >
                <h3 className="text-xl font-bold mb-3 text-white">We're Here to Help</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                    Average response time: 2-4 hours
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                    Available 24/7 for urgent issues
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                    Multilingual support team
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                    Dedicated account managers
                  </li>
                </ul>
              </motion.div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Follow Us</h3>
                <div className="flex gap-4">
                  {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social, idx) => (
                    <motion.a
                      key={idx}
                      href="#"
                      className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center hover:bg-amber-600 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-xs font-bold">{social.slice(0, 2)}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Looking for Quick Answers?</h2>
            <p className="text-gray-400 mb-8">
              Check out our FAQ section for commonly asked questions
            </p>
            <motion.a
              href="/faq"
              className="inline-block px-8 py-3 bg-amber-600 text-gray-900 rounded-lg font-bold hover:bg-amber-500 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Visit FAQ
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}