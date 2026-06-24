import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
// We can just use '/logo.png' directly in the img src
import logo from '../../public/logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isActiveSection = (sectionId) => {
    return location.pathname === '/' && sectionId === 'home';
  };

  const navLinks = [
    { label: 'Home', href: '/', id: 'home' },
    { label: 'Success Stories', href: '#success-stories', id: 'success-stories' },
    { label: 'Membership Plans', href: '#membership', id: 'membership' },
    { label: 'Contact Us', href: '#contact', id: 'contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 bg-white shadow-premium py-3`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="JOD Matrimony Logo" className='h-15 w-15 group-hover:scale-110 transition-transform duration-300' />
            <span className="hidden md:block text-2xl font-display text-pink-800 font-bold group-hover:text-pink-700 transition-colors">
              JOD Matrimony
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.href}
                className={`relative px-4 py-2 font-medium transition-all duration-300 group ${
                  isActive(link.href)
                    ? 'text-pink-700'
                    : 'text-gray-700 hover:text-pink-700'
                }`}
              >
                {link.label}
                {/* Animated underline for active link */}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-500 to-pink-600 transition-all duration-300 ${
                    isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/signin"
              className={`font-semibold transition-all duration-300 px-4 py-2 rounded-lg ${
                isActive('/signin')
                  ? 'text-pink-700 bg-pink-50'
                  : 'text-pink-700 hover:text-pink-800 hover:bg-pink-50'
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className={`font-semibold py-2 px-6 rounded-xl transition-all duration-300 ${
                isActive('/signup')
                  ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg shadow-pink-300/50'
                  : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:shadow-lg hover:shadow-pink-300/50 hover:scale-105'
              }`}
            >
              Register Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`text-gray-800 transition-all duration-300 hover:text-pink-700 ${
                isMobileMenuOpen ? 'text-pink-700' : ''
              }`}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl py-4 flex flex-col items-center space-y-2 animate-slideDown">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              to={link.href}
              className={`w-full text-center py-3 font-medium transition-all duration-300 ${
                isActive(link.href)
                  ? 'text-pink-700 bg-pink-50 border-l-4 border-pink-500'
                  : 'text-gray-800 hover:text-pink-700 hover:bg-pink-50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="w-4/5 h-px bg-gray-200 my-2"></div>
          
          <Link
            to="/signin"
            className={`w-4/5 text-center py-2 font-semibold rounded-lg transition-all duration-300 ${
              isActive('/signin')
                ? 'text-pink-700 bg-pink-50'
                : 'text-pink-700 hover:bg-pink-50'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign In
          </Link>
          
          <Link
            to="/signup"
            className={`w-4/5 text-center py-2 font-semibold rounded-lg transition-all duration-300 ${
              isActive('/signup')
                ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white'
                : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:shadow-lg hover:shadow-pink-300/50'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Register Free
          </Link>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;