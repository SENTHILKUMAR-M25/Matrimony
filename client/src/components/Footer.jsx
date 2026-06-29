import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="gradient-maroon text-gray-100 pt-20 pb-10 border-t-4 border-maroon-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand & Social */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl font-display font-bold text-white mb-6 block">
              JOD Matrimony
            </Link>
            <p className="text-sm text-gray-300 mb-6">
              Find your perfect life partner with our premium matchmaking service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gold-500 hover:text-white transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gold-500 hover:text-white transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gold-500 hover:text-white transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gold-500 hover:text-white transition-colors">
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Need Help</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-gold-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">Other Services</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#membership" className="hover:text-gold-400 transition-colors">Premium Membership</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Horoscope Match</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-gold-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row gap-6 text-sm">
            <div className="flex items-center gap-2">
              <FiPhone className="w-4 h-4 text-gold-500" />
              <span>+91 1234 567 890</span>
            </div>
            <div className="flex items-center gap-2">
              <FiMail className="w-4 h-4 text-gold-500" />
              <span>support@jodmatrimony.com</span>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin className="w-4 h-4 text-gold-500" />
              <span>123 Matrimony Tower, Mumbai</span>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} JOD Matrimony. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
