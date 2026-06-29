import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const navLinks = [
  { label: 'Home', href: '/', id: 'home' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Features', href: '#features', id: 'features' },
  { label: 'Success Stories', href: '#success-stories', id: 'success-stories' },
  { label: 'Membership Plans', href: '#membership', id: 'membership' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

const sectionIds = ['home', 'about', 'features', 'success-stories', 'membership', 'contact'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const observerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (location.pathname !== '/' || location.hash) {
      if (observerRef.current) {
        observerRef.current.forEach((o) => o.disconnect());
        observerRef.current = null;
      }
      return;
    }

    const handleIntersect = (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0) {
        setActiveSection(visible[0].target.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.2,
      rootMargin: '-80px 0px -40% 0px',
    });

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    elements.forEach((el) => observer.observe(el));
    observerRef.current = [observer];

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [location.pathname, location.hash]);

  const getActiveHref = useCallback(() => {
    if (location.pathname !== '/') return location.pathname;

    if (location.hash) return location.hash;

    return `#${activeSection}`;
  }, [location.pathname, location.hash, activeSection]);

  const isActive = (href) => {
    return getActiveHref() === href;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-white/80 backdrop-blur-xl shadow-lg`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img src={logo} alt="JOD Matrimony Logo" className="h-12 w-12 group-hover:scale-110 transition-transform duration-500" />
                <motion.div
                  className="absolute -inset-1 rounded-full bg-pink-500/20 blur-md"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className={`hidden md:block text-2xl font-display font-bold transition-colors duration-500  'text-pink-800' `}>
                JOD Matrimony
              </span>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-all text-gray-700 hover:text-pink-600 duration-300 group ${
                    isActive(link.href)
                      ? 'text-pink-600'
                      : 'text-gray-700 hover:text-pink-600' }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-pink-500 to-pink-600 transition-all duration-300 rounded-full ${
                    isActive(link.href) ? 'w-4/5' : 'w-0 group-hover:w-4/5'
                  }`} />
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              <Link
                to="/signin"
                className={`text-sm font-semibold transition-all duration-300 flex items-center text-gray-700 hover:text-pink-700 gap-1.5 `}
              >
                <LogIn size={16} />
                Login
              </Link>
              <Link
                to="/signup"
                className="relative inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/30 hover:scale-105"
              >
                <Heart size={16} className="fill-white/30 group-hover:fill-white transition-colors" />
                <span className="relative z-10">Find Your Match</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center text-white"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-gradient-to-b from-pink-900 via-pink-800 to-maroon-900 flex flex-col"
          >
            <div className="flex justify-end p-6">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X size={28} />
              </button>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 flex flex-col items-center justify-center space-y-1 px-6"
            >
              {navLinks.map((link) => (
                <motion.div key={link.id} variants={itemVariants} className="w-full max-w-xs">
                  <Link
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-center py-3.5 text-xl font-display font-semibold transition-all duration-300 rounded-lg ${
                      isActive(link.href)
                        ? 'text-pink-300 bg-white/10'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="px-6 pb-10 space-y-3"
            >
              <div className="flex gap-3 max-w-xs mx-auto">
                <Link
                  to="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  <LogIn size={18} />
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300"
                >
                  <UserPlus size={18} />
                  Register
                </Link>
              </div>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3 rounded-full bg-white text-pink-800 font-bold hover:bg-pink-50 transition-all duration-300 max-w-xs mx-auto"
              >
                <Heart size={18} className="fill-pink-500 text-pink-500" />
                Find Your Match
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
