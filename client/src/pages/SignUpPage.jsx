import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Mail, Lock, User, Phone, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import API from '../api/axios';

const SignUpPageWebPremium = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [completedFields, setCompletedFields] = useState(new Set());

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'onTouched',
  });

  const formData = watch();

  const handleFieldBlur = (fieldName) => {
    if (formData[fieldName]) {
      setCompletedFields(new Set([...completedFields, fieldName]));
    }
    setFocusedField(null);
  };

  const onSubmit = async (data) => {
    setServerError('');
    setIsSubmitting(true);
    try {
      const response = await API.post('/auth/signup', data);
      localStorage.setItem('token', response.data.token);
      setIsSuccess(true);
      setTimeout(() => navigate('/signin'), 2500);
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center p-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/3 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-32 right-1/4 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative z-10 max-w-2xl text-center">
          <div className="mb-8 inline-block">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-50 rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-pink-500 animate-bounce" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to Your Journey!</h1>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-lg mx-auto">
            Your account has been created successfully. Now discover meaningful connections and find your perfect match.
          </p>

          <div className="flex gap-4 justify-center mb-8">
            <button
              onClick={() => navigate('/signin')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-pink-300/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              Continue to Sign In <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 border-2 border-gray-300 text-gray-900 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Back to Home
            </button>
          </div>

          <div className="flex justify-center gap-3">
            <Sparkles size={20} className="text-pink-500 animate-spin" style={{ animationDuration: '3s' }} />
            <p className="text-sm text-gray-600">Redirecting to sign in...</p>
          </div>
        </div>
      </div>
    );
  }

  const inputFieldConfig = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      icon: User,
      placeholder: 'John',
      rules: { required: 'First name is required' },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      icon: User,
      placeholder: 'Doe',
      rules: { required: 'Last name is required' },
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      icon: Mail,
      placeholder: 'you@example.com',
      rules: {
        required: 'Email is required',
        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
      },
    },
    {
      name: 'mobile',
      label: 'Mobile Number',
      type: 'tel',
      icon: Phone,
      placeholder: '9876543210',
      rules: {
        required: 'Mobile number is required',
        pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit number' },
      },
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      icon: Lock,
      placeholder: '••••••••',
      rules: {
        required: 'Password is required',
        minLength: { value: 6, message: 'Password must be at least 6 characters' },
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 overflow-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-100/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-16">
            <Link to="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <Heart size={24} className="text-white fill-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">JOD</h2>
                  <p className="text-xs text-gray-600 -mt-1">Matrimony</p>
                </div>
              </div>
            </Link>
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/signin" className="font-semibold text-pink-600 hover:text-pink-700 transition-colors">
                Sign In
              </Link>
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-2 gap-16 items-center min-h-[600px]">
            {/* Left Side - Content & Value Proposition */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="text-sm font-semibold text-pink-600 bg-pink-100/50 px-4 py-2 rounded-full backdrop-blur-sm">
                    ✨ Find Love, Build Trust
                  </span>
                </div>
                <h1 className="text-6xl font-bold leading-tight text-gray-900">
                  Discover Your
                  <span className="block bg-gradient-to-r from-pink-500 via-pink-600 to-red-500 text-transparent bg-clip-text">
                    Perfect Match
                  </span>
                </h1>
              </div>

              <p className="text-xl text-gray-600 leading-relaxed max-w-md">
                Join millions of singles looking for meaningful relationships. Our verified profiles and smart matching algorithms help you find someone truly compatible.
              </p>

              {/* Trust Indicators */}
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart size={20} className="text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Verified Profiles</h3>
                    <p className="text-sm text-gray-600">100% genuine members with photo verification</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles size={20} className="text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Smart Matching</h3>
                    <p className="text-sm text-gray-600">AI-powered compatibility based on your preferences</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-pink-100/50">
                <div>
                  <p className="text-3xl font-bold text-gray-900">50K+</p>
                  <p className="text-sm text-gray-600">Success Stories</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">10M+</p>
                  <p className="text-sm text-gray-600">Active Members</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">99%</p>
                  <p className="text-sm text-gray-600">Verified Users</p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div>
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/20">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                  <p className="text-gray-600">Join thousands finding love today</p>
                </div>

                {serverError && (
                  <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                    <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 font-medium">{serverError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {inputFieldConfig.map((field) => {
                    const Icon = field.icon;
                    const isCompleted = completedFields.has(field.name);
                    const isFocused = focusedField === field.name;
                    const hasError = errors[field.name];

                    return (
                      <div key={field.name} className="group">
                        <label className="block text-sm font-semibold text-gray-900 mb-2.5 ml-1">
                          {field.label}
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-600 transition-colors duration-300 pointer-events-none">
                            <Icon size={20} />
                          </div>
                          <input
                            type={field.type}
                            {...register(field.name, field.rules)}
                            onFocus={() => setFocusedField(field.name)}
                            onBlur={() => handleFieldBlur(field.name)}
                            placeholder={field.placeholder}
                            className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 outline-none font-medium text-gray-900 placeholder-gray-400 ${
                              hasError
                                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/30'
                                : isFocused
                                ? 'border-pink-500 focus:ring-2 focus:ring-pink-200 bg-white shadow-lg'
                                : isCompleted
                                ? 'border-green-300 bg-green-50/30'
                                : 'border-gray-200 hover:border-pink-200 bg-gray-50/50'
                            }`}
                          />
                          {isCompleted && !hasError && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500">
                              <CheckCircle size={20} className="fill-green-500" />
                            </div>
                          )}
                        </div>
                        {hasError && (
                          <p className="text-xs text-red-500 mt-2 ml-1 font-medium">{hasError.message}</p>
                        )}
                      </div>
                    );
                  })}

                  {/* Gender Select */}
                  <div className="group pt-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2.5 ml-1">
                      Gender
                    </label>
                    <select
                      {...register('gender', { required: 'Please select your gender' })}
                      onFocus={() => setFocusedField('gender')}
                      onBlur={() => handleFieldBlur('gender')}
                      className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-300 outline-none font-medium text-gray-900 ${
                        errors.gender
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/30'
                          : focusedField === 'gender'
                          ? 'border-pink-500 focus:ring-2 focus:ring-pink-200 bg-white shadow-lg'
                          : completedFields.has('gender')
                          ? 'border-green-300 bg-green-50/30'
                          : 'border-gray-200 hover:border-pink-200 bg-gray-50/50'
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-xs text-red-500 mt-2 ml-1 font-medium">{errors.gender.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-pink-300/50 active:scale-95 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create My Account'}
                    {!isSubmitting && (
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>

                  {/* Terms */}
                  <p className="text-center text-xs text-gray-600 mt-6">
                    By signing up, you agree to our{' '}
                    <a href="#" className="text-pink-600 hover:text-pink-700 font-semibold">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-pink-600 hover:text-pink-700 font-semibold">
                      Privacy Policy
                    </a>
                  </p>
                </form>
              </div>

              {/* Social Proof */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-3">Trusted by singles worldwide</p>
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-pink-500 text-lg">
                      ★
                    </span>
                  ))}
                  <span className="text-xs text-gray-600 ml-2">(4.9/5 from 50K+ reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-25px) translateX(5px);
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SignUpPageWebPremium;