import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const navLinks = [
  { label: 'Home', href: '/', id: 'home' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Success Stories', href: '#success-stories', id: 'success-stories' },
  { label: 'Membership Plans', href: '#membership', id: 'membership' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

const sectionIds = ['home', 'about', 'features', 'success-stories', 'membership', 'contact'];

const dropdownVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' },
  }),
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const observerRef = useRef(null);
  const navRef = useRef(null);

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
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
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

  const isActive = (href) => getActiveHref() === href;

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl shadow-lg transition-all duration-500 `}
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
            <span className={`hidden md:block text-2xl font-display font-bold transition-colors duration-500 text-pink-800`}>
              JOD Matrimony
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.href}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
                  isActive(link.href)
                    ? 'text-pink-600'
                    : 'text-gray-700 hover:text-pink-600'
                }`}
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
              className="text-sm font-semibold transition-all duration-300 flex items-center text-gray-700 hover:text-pink-700 gap-1.5"
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
            onClick={() => setIsMobileMenuOpen((p) => !p)}
            className={`lg:hidden relative w-10 h-10 flex items-center justify-center transition-colors ${
              isMobileMenuOpen ? 'text-pink-600' : 'text-gray-700'
            }`}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100 shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.id}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2.5 px-4 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive(link.href)
                        ? 'text-pink-600 bg-pink-50'
                        : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-4 mt-2 border-t border-gray-100 space-y-2.5">
                <Link
                  to="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:border-pink-200 transition-all"
                >
                  <LogIn size={16} />
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                >
                  <UserPlus size={16} />
                  Register
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                >
                  <Heart size={16} className="fill-white/60" />
                  Find Your Match
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
