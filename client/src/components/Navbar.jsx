import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from "../../public/logo.png"
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 bg-white shadow-premium py-3 `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="" className='h-15 w-15'/>
            <span
              className={`hidden md:block text-2xl font-display text-maroon-800 font-bold`}
            >
              JOD Matrimony
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`nav-link font-medium text-gray-700 hover:text-maroon-700`}
            >
              Home
            </Link>
            <a
              href="#success-stories"
              className={`nav-link font-medium text-gray-700 hover:text-maroon-700`}
            >
              Success Stories
            </a>
            <a
              href="#membership"
              className={`nav-link font-medium text-gray-700 hover:text-maroon-700`}
            >
              Membership Plans
            </a>
            <a
              href="#contact"
              className={`nav-link font-medium text-gray-700 hover:text-maroon-700`}
            >
              Contact Us
            </a>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/signin"
              className={`font-semibold transition-colors text-maroon-700 hover:text-maroon-800`}
            >
              Sign In
            </Link>
            <Link to="/signup" className="btn-primary !py-2 !px-6">
              Register Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={'text-gray-800'}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl py-4 flex flex-col items-center space-y-4">
          <Link to="/" className="text-gray-800 font-medium hover:text-maroon-700" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <a href="#success-stories" className="text-gray-800 font-medium hover:text-maroon-700" onClick={() => setIsMobileMenuOpen(false)}>Success Stories</a>
          <a href="#membership" className="text-gray-800 font-medium hover:text-maroon-700" onClick={() => setIsMobileMenuOpen(false)}>Membership Plans</a>
          <a href="#contact" className="text-gray-800 font-medium hover:text-maroon-700" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</a>
          <div className="w-full h-px bg-gray-100 my-2"></div>
          <Link to="/signin" className="text-maroon-700 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
          <Link to="/signup" className="btn-primary" onClick={() => setIsMobileMenuOpen(false)}>Register Free</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
