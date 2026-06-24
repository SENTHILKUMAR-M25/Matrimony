import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import useAuthStore from '../store/useAuthStore';

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.identifier || !formData.password) {
      setError('Please fill in both fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await API.post('/auth/login', formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      
      // Update global auth state with user + token
      login(user, token);

      // If profile not completed, go to create-profile; otherwise dashboard
      if (user.profileCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/create-profile');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch">
      {/* Left Side: Image */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1583939411023-14783179e581?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 to-black/30"></div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full text-white p-12 text-center">
          <h1 className="text-5xl font-display font-bold mb-4">Welcome Back!</h1>
          <p className="text-xl max-w-md">Continue your journey to finding the perfect life partner with JOD Matrimony.</p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <Link to="/" className="text-3xl font-display font-bold gradient-text-pink inline-block mb-2">JOD Matrimony</Link>
            <h2 className="text-2xl font-bold text-gray-900">Sign In to Your Account</h2>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-premium border border-gray-100">
            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email or Mobile Number</label>
                <input 
                  type="text" 
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="input-pink w-full"
                  placeholder="Enter email or mobile"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-sm font-semibold text-pink-600 hover:text-pink-700">Forgot Password?</a>
                </div>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-pink w-full"
                  placeholder="Enter password"
                />
              </div>

              <div className="flex items-center">
                <input id="remember" type="checkbox" className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded" />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full btn-primary justify-center !py-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <button type="button" className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-pink-300 transition-colors">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-pink-700 hover:text-pink-800">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;