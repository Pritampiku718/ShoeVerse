import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
  FiArrowRight,
  FiHeart,
  FiShield,
  FiTruck,
  FiAward,
  FiCheckCircle,
} from "react-icons/fi";

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const footerSections = [
    {
      title: "Shop",
      links: [
        { label: "Men's Collection", href: "/category/men", icon: "👟" },
        { label: "Women's Collection", href: "/category/women", icon: "👠" },
        { label: "Kids' Collection", href: "/category/kids", icon: "🧸" },
        {
          label: "New Arrivals",
          href: "/new-arrivals",
          icon: "✨",
          badge: "HOT",
        },
        {
          label: "Limited Edition",
          href: "/limited",
          icon: "🔥",
          badge: "EXCLUSIVE",
        },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "/contact", icon: "📞" },
        { label: "FAQs", href: "/faqs", icon: "❓" },
        { label: "Shipping Info", href: "/shipping", icon: "📦" },
        { label: "Returns Policy", href: "/returns", icon: "↩️" },
        { label: "Size Guide", href: "/size-guide", icon: "📏" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about", icon: "🏢" },
        { label: "Careers", href: "/careers", icon: "💼", badge: "HIRING" },
        { label: "Blog", href: "/blog", icon: "📝" },
        { label: "Press", href: "/press", icon: "📰" },
        { label: "Affiliates", href: "/affiliates", icon: "🤝" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms", icon: "📜" },
        { label: "Privacy Policy", href: "/privacy", icon: "🔒" },
        { label: "Cookie Policy", href: "/cookies", icon: "🍪" },
        { label: "Accessibility", href: "/accessibility", icon: "♿" },
      ],
    },
  ];

  const socialLinks = [
    { icon: FiFacebook, href: "https://facebook.com" },
    { icon: FiTwitter, href: "https://twitter.com" },
    { icon: FiInstagram, href: "https://instagram.com" },
    { icon: FiYoutube, href: "https://youtube.com" },
  ];

  const paymentMethods = ["VISA", "MC", "AMEX", "PP", "APL", "GPAY"];

  const stats = [
    { icon: FiTruck, value: "Free Shipping", label: "On orders $100+" },
    { icon: FiShield, value: "100% Authentic", label: "Guaranteed" },
    { icon: FiAward, value: "2 Year Warranty", label: "On all products" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer
      ref={ref}
      className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white pt-10 pb-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Bar */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl"
              >
                <div className="p-2 bg-gradient-to-r from-primary-600 to-accent rounded-lg">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-black bg-gradient-to-r from-primary-400 via-accent to-primary-400 bg-clip-text text-transparent">
                ShoeVerse
              </span>
            </Link>

            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Premium sneaker destination for collectors and trendsetters.
            </p>

            <div className="space-y-3 mb-6 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <FiMapPin size={14} />
                123 Sneaker Street, New York, NY 10001
              </div>
              <div className="flex items-center gap-3">
                <FiPhone size={14} />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-3">
                <FiMail size={14} />
                hello@shoeverse.com
              </div>
            </div>

            <div className="flex gap-2">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="flex items-center justify-between text-sm text-gray-400 hover:text-white transition"
                    >
                      <span className="flex items-center gap-2">
                        <span>{link.icon}</span>
                        {link.label}
                      </span>
                      {link.badge && (
                        <span className="text-[10px] px-2 py-0.5 bg-red-500 text-white rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Compact Newsletter */}
        <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold">
              Get 10% Off Your First Order
            </h4>
            <p className="text-xs text-gray-400">Join our sneaker community</p>
          </div>

          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 md:w-56 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-primary-600 text-sm"
            />
            <button className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent text-white rounded-r-lg text-sm font-medium">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-800 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>We Accept:</span>
            {paymentMethods.map((method) => (
              <div
                key={method}
                className="px-2 py-1 bg-gray-800 rounded text-xs font-semibold"
              >
                {method}
              </div>
            ))}
          </div>

          <p>
            © {new Date().getFullYear()} ShoeVerse. Made with{" "}
            <FiHeart className="inline text-red-500" size={14} /> for
            sneakerheads
          </p>

          <div className="flex items-center gap-1 text-xs">
            <FiCheckCircle className="text-green-500" size={14} />
            100% Authentic
          </div>
        </div>

        {/* Bottom Links */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-gray-600">
          <Link to="/sitemap">Sitemap</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/cookies">Cookies</Link>
          <Link to="/accessibility">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
