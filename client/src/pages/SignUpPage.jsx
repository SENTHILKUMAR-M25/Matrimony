// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Link, useNavigate } from 'react-router-dom';
// import { Heart, ArrowRight, Mail, Lock, User, Phone, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
// import API from '../api/axios';

// const SignUpPageWebPremium = () => {
//   const navigate = useNavigate();
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [serverError, setServerError] = useState('');
//   const [focusedField, setFocusedField] = useState(null);
//   const [completedFields, setCompletedFields] = useState(new Set());

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//   } = useForm({
//     mode: 'onTouched',
//   });

//   const formData = watch();

//   const handleFieldBlur = (fieldName) => {
//     if (formData[fieldName]) {
//       setCompletedFields(new Set([...completedFields, fieldName]));
//     }
//     setFocusedField(null);
//   };

//   const onSubmit = async (data) => {
//     setServerError('');
//     setIsSubmitting(true);
//     try {
//       const response = await API.post('/auth/signup', data);
//       localStorage.setItem('token', response.data.token);
//       setIsSuccess(true);
//       setTimeout(() => navigate('/signin'), 2500);
//     } catch (error) {
//       const message = error.response?.data?.message || 'Something went wrong. Please try again.';
//       setServerError(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isSuccess) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center p-8 overflow-hidden">
//         {/* Animated background elements */}
//         <div className="absolute inset-0 pointer-events-none">
//           <div className="absolute top-20 left-1/3 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse" />
//           <div className="absolute bottom-32 right-1/4 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
//         </div>

//         <div className="relative z-10 max-w-2xl text-center">
//           <div className="mb-8 inline-block">
//             <div className="relative w-32 h-32 mx-auto">
//               <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-50 rounded-full animate-pulse" />
//               <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
//                 <CheckCircle className="w-16 h-16 text-pink-500 animate-bounce" />
//               </div>
//             </div>
//           </div>

//           <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to Your Journey!</h1>
//           <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-lg mx-auto">
//             Your account has been created successfully. Now discover meaningful connections and find your perfect match.
//           </p>

//           <div className="flex gap-4 justify-center mb-8">
//             <button
//               onClick={() => navigate('/signin')}
//               className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-pink-300/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
//             >
//               Continue to Sign In <ArrowRight size={20} />
//             </button>
//             <button
//               onClick={() => navigate('/')}
//               className="px-8 py-4 border-2 border-gray-300 text-gray-900 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300"
//             >
//               Back to Home
//             </button>
//           </div>

//           <div className="flex justify-center gap-3">
//             <Sparkles size={20} className="text-pink-500 animate-spin" style={{ animationDuration: '3s' }} />
//             <p className="text-sm text-gray-600">Redirecting to sign in...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const inputFieldConfig = [
//     {
//       name: 'firstName',
//       label: 'First Name',
//       type: 'text',
//       icon: User,
//       placeholder: 'John',
//       rules: { required: 'First name is required' },
//     },
//     {
//       name: 'lastName',
//       label: 'Last Name',
//       type: 'text',
//       icon: User,
//       placeholder: 'Doe',
//       rules: { required: 'Last name is required' },
//     },
//     {
//       name: 'email',
//       label: 'Email Address',
//       type: 'email',
//       icon: Mail,
//       placeholder: 'you@example.com',
//       rules: {
//         required: 'Email is required',
//         pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
//       },
//     },
//     {
//       name: 'mobile',
//       label: 'Mobile Number',
//       type: 'tel',
//       icon: Phone,
//       placeholder: '9876543210',
//       rules: {
//         required: 'Mobile number is required',
//         pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit number' },
//       },
//     },
//     {
//       name: 'password',
//       label: 'Password',
//       type: 'password',
//       icon: Lock,
//       placeholder: '••••••••',
//       rules: {
//         required: 'Password is required',
//         minLength: { value: 6, message: 'Password must be at least 6 characters' },
//       },
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 overflow-hidden">
//       {/* Animated background orbs */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-float" />
//         <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-100/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
//         <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10">
//         <div className="max-w-7xl mx-auto px-8 py-12">
         

//           {/* Main Grid */}
//           <div className="grid grid-cols-2 gap-16 items-center min-h-[600px]">
//             {/* Left Side - Content & Value Proposition */}
//             <div className="space-y-8">
//               <div className="space-y-4">
//                 <div className="inline-block">
//                   <span className="text-sm font-semibold text-pink-600 bg-pink-100/50 px-4 py-2 rounded-full backdrop-blur-sm">
//                     ✨ Find Love, Build Trust
//                   </span>
//                 </div>
//                 <h1 className="text-6xl font-bold leading-tight text-gray-900">
//                   Discover Your
//                   <span className="block bg-gradient-to-r from-pink-500 via-pink-600 to-pink-800 text-transparent bg-clip-text">
//                     Perfect Match
//                   </span>
//                 </h1>
//               </div>

//               <p className="text-xl text-gray-600 leading-relaxed max-w-md">
//                 Join millions of singles looking for meaningful relationships. Our verified profiles and smart matching algorithms help you find someone truly compatible.
//               </p>

//               {/* Trust Indicators */}
//               <div className="space-y-3 pt-4">
//                 <div className="flex items-start gap-4">
//                   <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
//                     <Heart size={20} className="text-pink-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900">Verified Profiles</h3>
//                     <p className="text-sm text-gray-600">100% genuine members with photo verification</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-4">
//                   <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
//                     <Sparkles size={20} className="text-pink-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900">Smart Matching</h3>
//                     <p className="text-sm text-gray-600">AI-powered compatibility based on your preferences</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Stats */}
//               <div className="grid grid-cols-3 gap-4 pt-8 border-t border-pink-100/50">
//                 <div>
//                   <p className="text-3xl font-bold text-gray-900">50K+</p>
//                   <p className="text-sm text-gray-600">Success Stories</p>
//                 </div>
//                 <div>
//                   <p className="text-3xl font-bold text-gray-900">10M+</p>
//                   <p className="text-sm text-gray-600">Active Members</p>
//                 </div>
//                 <div>
//                   <p className="text-3xl font-bold text-gray-900">99%</p>
//                   <p className="text-sm text-gray-600">Verified Users</p>
//                 </div>
//               </div>
//             </div>

//             {/* Right Side - Form */}
//             <div>
//               <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/20">
//                 <div className="mb-8">
//                   <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
//                   <p className="text-gray-600">Join thousands finding love today</p>
//                 </div>

//                 {serverError && (
//                   <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
//                     <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
//                     <p className="text-sm text-red-600 font-medium">{serverError}</p>
//                   </div>
//                 )}

//                 <form onSubmit={handleSubmit(onSubmit)} className="h-[55vh] flex flex-col justify-between">
//                   {/* Scrollable Input Fields Container */}
//                   <div className="space-y-4 overflow-y-auto pr-1 max-h-[50vh] custom-scrollbar">
//                     {inputFieldConfig.map((field) => {
//                       const Icon = field.icon;
//                       const isCompleted = completedFields.has(field.name);
//                       const isFocused = focusedField === field.name;
//                       const hasError = errors[field.name];

//                       return (
//                         <div key={field.name} className="group">
//                           <label className="block text-xs font-bold text-[#3B1E54] mb-1.5 ml-1 uppercase tracking-wide">
//                             {field.label}
//                           </label>
//                           <div className="relative">
//                             <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#9B7EBD] transition-colors duration-300 pointer-events-none">
//                               <Icon size={18} />
//                             </div>
//                             <input
//                               type={field.type}
//                               {...register(field.name, field.rules)}
//                               onFocus={() => setFocusedField(field.name)}
//                               onBlur={() => handleFieldBlur(field.name)}
//                               placeholder={field.placeholder}
//                               className={`w-full pl-11 pr-11 py-2.5 rounded-xl border-2 transition-all duration-300 outline-none font-medium text-gray-900 text-sm placeholder-gray-400 ${hasError
//                                   ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/20'
//                                   : isFocused
//                                     ? 'border-[#9B7EBD] focus:ring-2 focus:ring-[#D4BEE4]/40 bg-white shadow-md'
//                                     : isCompleted
//                                       ? 'border-green-200 bg-green-50/20'
//                                       : 'border-gray-200 hover:border-[#D4BEE4] bg-gray-50/30'
//                                 }`}
//                             />
//                             {isCompleted && !hasError && (
//                               <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500">
//                                 <CheckCircle size={18} className="fill-green-100" />
//                               </div>
//                             )}
//                           </div>
//                           {hasError && (
//                             <p className="text-[11px] text-red-500 mt-1 ml-1 font-semibold">{hasError.message}</p>
//                           )}
//                         </div>
//                       );
//                     })}

//                     {/* Gender Select Box */}
//                     <div className="group">
//                       <label className="block text-xs font-bold text-[#3B1E54] mb-1.5 ml-1 uppercase tracking-wide">
//                         Gender
//                       </label>
//                       <select
//                         {...register('gender', { required: 'Please select your gender' })}
//                         onFocus={() => setFocusedField('gender')}
//                         onBlur={() => handleFieldBlur('gender')}
//                         className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-300 outline-none font-medium text-gray-900 text-sm ${errors.gender
//                             ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/20'
//                             : focusedField === 'gender'
//                               ? 'border-[#9B7EBD] focus:ring-2 focus:ring-[#D4BEE4]/40 bg-white shadow-md'
//                               : completedFields.has('gender')
//                                 ? 'border-green-200 bg-green-50/20'
//                                 : 'border-gray-200 hover:border-[#D4BEE4] bg-gray-50/30'
//                           }`}
//                       >
//                         <option value="">Select Gender</option>
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                         <option value="other">Other</option>
//                       </select>
//                       {errors.gender && (
//                         <p className="text-[11px] text-red-500 mt-1 ml-1 font-semibold">{errors.gender.message}</p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Fixed Footer Segment (Submit Button & Legal Guidelines) */}
//                   <div className="pt-4 border-t border-gray-100 bg-white">
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="w-full py-3 bg-[#3B1E54] hover:bg-[#3B1E54]/95 active:scale-[0.99] text-white rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
//                     >
//                       {isSubmitting ? 'Creating Account...' : 'Create My Account'}
//                       {!isSubmitting && (
//                         <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
//                       )}
//                     </button>

//                     <p className="text-center text-[11px] text-gray-500 mt-3.5 leading-normal">
//                       By signing up, you agree to our{' '}
//                       <a href="#" className="text-[#9B7EBD] hover:text-[#3B1E54] font-bold underline decoration-[#D4BEE4]">
//                         Terms of Service
//                       </a>{' '}
//                       and{' '}
//                       <a href="#" className="text-[#9B7EBD] hover:text-[#3B1E54] font-bold underline decoration-[#D4BEE4]">
//                         Privacy Policy
//                       </a>
//                     </p>
//                   </div>
//                 </form>
//               </div>

//               {/* Social Proof */}
//               <div className="mt-6 text-center">
//                 <p className="text-sm text-gray-600 mb-3">Trusted by singles worldwide</p>
//                 <div className="flex items-center justify-center gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     <span key={i} className="text-pink-500 text-lg">
//                       ★
//                     </span>
//                   ))}
//                   <span className="text-xs text-gray-600 ml-2">(4.9/5 from 50K+ reviews)</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes float {
//           0%, 100% {
//             transform: translateY(0px) translateX(0px);
//           }
//           25% {
//             transform: translateY(-20px) translateX(10px);
//           }
//           50% {
//             transform: translateY(-10px) translateX(-10px);
//           }
//           75% {
//             transform: translateY(-25px) translateX(5px);
//           }
//         }

//         .animate-float {
//           animation: float 8s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SignUpPageWebPremium;





// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Heart, ArrowRight, Mail, Lock, User, Phone, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
// import API from '../api/axios';

// const fadeUp = {
//   hidden: { opacity: 0, y: 24 },
//   visible: (i = 0) => ({
//     opacity: 1, y: 0,
//     transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
//   }),
// };

// const SignUpPage = () => {
//   const navigate = useNavigate();
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [serverError, setServerError] = useState('');
//   const [focusedField, setFocusedField] = useState(null);
//   const [completedFields, setCompletedFields] = useState(new Set());

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//   } = useForm({
//     mode: 'onTouched',
//   });

//   const formData = watch();

//   const handleFieldBlur = (fieldName) => {
//     if (formData[fieldName]) {
//       setCompletedFields(new Set([...completedFields, fieldName]));
//     }
//     setFocusedField(null);
//   };

//   const onSubmit = async (data) => {
//     setServerError('');
//     setIsSubmitting(true);
//     try {
//       const response = await API.post('/auth/signup', data);
//       localStorage.setItem('token', response.data.token);
//       setIsSuccess(true);
//       setTimeout(() => navigate('/signin'), 2500);
//     } catch (error) {
//       const message = error.response?.data?.message || 'Something went wrong. Please try again.';
//       setServerError(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isSuccess) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.6 }}
//         className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center p-4 sm:p-8 overflow-hidden relative"
//       >
//         <div className="absolute inset-0 pointer-events-none z-0">
//           <div className="absolute top-20 left-1/3 w-72 sm:w-96 h-72 sm:h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse" />
//           <div className="absolute bottom-32 right-1/4 w-56 sm:w-72 h-56 sm:h-72 bg-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
//         </div>

//         <div className="relative z-10 max-w-2xl text-center px-2">
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
//             className="mb-6 sm:mb-8 inline-block"
//           >
//             <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
//               <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-50 rounded-full animate-pulse" />
//               <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
//                 <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-pink-500" />
//               </div>
//             </div>
//           </motion.div>

//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight"
//           >
//             Welcome to Your Journey!
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//             className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12 leading-relaxed max-w-lg mx-auto"
//           >
//             Your account has been created successfully. Now discover meaningful connections and find your perfect match.
//           </motion.p>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6 }}
//             className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8"
//           >
//             <button
//               onClick={() => navigate('/signin')}
//               className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl sm:rounded-full font-semibold hover:shadow-2xl hover:shadow-pink-300/50 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
//             >
//               Continue to Sign In <ArrowRight size={18} />
//             </button>
//             <button
//               onClick={() => navigate('/')}
//               className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-200 text-gray-900 rounded-xl sm:rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 active:scale-[0.98] text-sm sm:text-base"
//             >
//               Back to Home
//             </button>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.8 }}
//             className="flex justify-center gap-2"
//           >
//             <Sparkles size={18} className="text-pink-500 animate-spin" style={{ animationDuration: '3s' }} />
//             <p className="text-xs sm:text-sm text-gray-500">Redirecting to sign in...</p>
//           </motion.div>
//         </div>
//       </motion.div>
//     );
//   }

//   const inputFieldConfig = [
//     {
//       name: 'firstName',
//       label: 'First Name',
//       type: 'text',
//       icon: User,
//       placeholder: 'John',
//       rules: { required: 'First name is required' },
//     },
//     {
//       name: 'lastName',
//       label: 'Last Name',
//       type: 'text',
//       icon: User,
//       placeholder: 'Doe',
//       rules: { required: 'Last name is required' },
//     },
//     {
//       name: 'email',
//       label: 'Email Address',
//       type: 'email',
//       icon: Mail,
//       placeholder: 'you@example.com',
//       rules: {
//         required: 'Email is required',
//         pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
//       },
//     },
//     {
//       name: 'mobile',
//       label: 'Mobile Number',
//       type: 'tel',
//       icon: Phone,
//       placeholder: '9876543210',
//       rules: {
//         required: 'Mobile number is required',
//         pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit number' },
//       },
//     },
//     {
//       name: 'password',
//       label: 'Password',
//       type: 'password',
//       icon: Lock,
//       placeholder: '••••••••',
//       rules: {
//         required: 'Password is required',
//         minLength: { value: 6, message: 'Password must be at least 6 characters' },
//       },
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 relative overflow-hidden">
//       {/* Background orbs */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-pink-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
//         <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
//       </div>

//       <div className="relative z-10 min-h-screen flex items-center">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-[calc(100vh-6rem)]">

//             {/* ─── Left Side ─── */}
//             <div className="lg:col-span-6 space-y-6 lg:space-y-8 order-2 lg:order-1">
//               <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
//                 <div className="inline-block">
//                   <span className="text-sm font-semibold text-pink-600 bg-pink-100/50 px-4 py-2 rounded-full backdrop-blur-sm">
//                     <Sparkles size={14} className="inline mr-1 -mt-0.5" />
//                     Find Love, Build Trust
//                   </span>
//                 </div>
//                 <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold leading-tight text-gray-900 tracking-tight">
//                   Discover Your{' '}
//                   <span className="block sm:inline bg-gradient-to-r from-pink-500 via-pink-600 to-pink-800 text-transparent bg-clip-text">
//                     Perfect Match
//                   </span>
//                 </h1>
//               </motion.div>

//               <motion.p custom={1} variants={fadeUp} initial="hidden" animate="visible" className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md">
//                 Join millions of singles looking for meaningful relationships. Our verified profiles and smart matching algorithms help you find someone truly compatible.
//               </motion.p>

//               <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="space-y-4 pt-2">
//                 <div className="flex items-start gap-4">
//                   <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
//                     <Heart size={20} className="text-pink-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Verified Profiles</h3>
//                     <p className="text-xs sm:text-sm text-gray-600">100% genuine members with photo verification</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-4">
//                   <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
//                     <Sparkles size={20} className="text-pink-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Smart Matching</h3>
//                     <p className="text-xs sm:text-sm text-gray-600">AI-powered compatibility based on your preferences</p>
//                   </div>
//                 </div>
//               </motion.div>

//               <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-3 gap-4 pt-6 border-t border-pink-100/50 max-w-md">
//                 <div>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900">50K+</p>
//                   <p className="text-xs sm:text-sm text-gray-600">Success Stories</p>
//                 </div>
//                 <div>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900">10M+</p>
//                   <p className="text-xs sm:text-sm text-gray-600">Active Members</p>
//                 </div>
//                 <div>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900">99%</p>
//                   <p className="text-xs sm:text-sm text-gray-600">Verified Users</p>
//                 </div>
//               </motion.div>
//             </div>

//             {/* ─── Right Side ─── */}
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               className="lg:col-span-6 w-full max-w-xl lg:max-w-none mx-auto order-1 lg:order-2"
//             >
//               <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border border-white/20">
//                 {/* Brand on mobile */}
//                 <div className="lg:hidden text-center mb-6">
//                   <Link to="/" className="text-xl font-display font-bold bg-gradient-to-r from-pink-500 to-pink-700 text-transparent bg-clip-text inline-block">
//                     JOD Matrimony
//                   </Link>
//                 </div>

//                 <div className="mb-6">
//                   <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Create Your Account</h2>
//                   <p className="text-sm text-gray-500">Join thousands finding love today</p>
//                 </div>

//                 {serverError && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200"
//                   >
//                     <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
//                     <p className="text-sm text-red-600 font-medium">{serverError}</p>
//                   </motion.div>
//                 )}

//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                   {inputFieldConfig.map((field, idx) => {
//                     const Icon = field.icon;
//                     const isCompleted = completedFields.has(field.name);
//                     const isFocused = focusedField === field.name;
//                     const hasError = errors[field.name];

//                     return (
//                       <motion.div
//                         key={field.name}
//                         custom={idx}
//                         variants={fadeUp}
//                         initial="hidden"
//                         animate="visible"
//                       >
//                         <label className="block text-xs font-bold text-[#3B1E54] mb-1 ml-1 uppercase tracking-wide">
//                           {field.label}
//                         </label>
//                         <div className="relative">
//                           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#9B7EBD] transition-colors duration-300 pointer-events-none">
//                             <Icon size={18} />
//                           </div>
//                           <input
//                             type={field.type}
//                             {...register(field.name, field.rules)}
//                             onFocus={() => setFocusedField(field.name)}
//                             onBlur={() => handleFieldBlur(field.name)}
//                             placeholder={field.placeholder}
//                             className={`w-full pl-11 pr-11 py-2.5 rounded-xl border-2 transition-all duration-300 outline-none font-medium text-gray-900 text-sm placeholder-gray-400 ${
//                               hasError
//                                 ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/20'
//                                 : isFocused
//                                   ? 'border-[#9B7EBD] focus:ring-2 focus:ring-[#D4BEE4]/40 bg-white shadow-md'
//                                   : isCompleted
//                                     ? 'border-green-200 bg-green-50/20'
//                                     : 'border-gray-200 hover:border-[#D4BEE4] bg-gray-50/30'
//                             }`}
//                           />
//                           {isCompleted && !hasError && (
//                             <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
//                               <CheckCircle size={18} className="fill-green-100" />
//                             </div>
//                           )}
//                         </div>
//                         {hasError && (
//                           <p className="text-[11px] text-red-500 mt-1 ml-1 font-semibold">{hasError.message}</p>
//                         )}
//                       </motion.div>
//                     );
//                   })}

//                   {/* Gender Select */}
//                   <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
//                     <label className="block text-xs font-bold text-[#3B1E54] mb-1 ml-1 uppercase tracking-wide">
//                       Gender
//                     </label>
//                     <select
//                       {...register('gender', { required: 'Please select your gender' })}
//                       onFocus={() => setFocusedField('gender')}
//                       onBlur={() => handleFieldBlur('gender')}
//                       className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-300 outline-none font-medium text-gray-900 text-sm ${
//                         errors.gender
//                           ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/20'
//                           : focusedField === 'gender'
//                             ? 'border-[#9B7EBD] focus:ring-2 focus:ring-[#D4BEE4]/40 bg-white shadow-md'
//                             : completedFields.has('gender')
//                               ? 'border-green-200 bg-green-50/20'
//                               : 'border-gray-200 hover:border-[#D4BEE4] bg-gray-50/30'
//                       }`}
//                     >
//                       <option value="">Select Gender</option>
//                       <option value="male">Male</option>
//                       <option value="female">Female</option>
//                       <option value="other">Other</option>
//                     </select>
//                     {errors.gender && (
//                       <p className="text-[11px] text-red-500 mt-1 ml-1 font-semibold">{errors.gender.message}</p>
//                     )}
//                   </motion.div>

//                   {/* Footer */}
//                   <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="pt-4 border-t border-gray-100">
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="w-full py-3 bg-[#3B1E54] hover:bg-[#3B1E54]/95 active:scale-[0.99] text-white rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                           Creating Account...
//                         </>
//                       ) : (
//                         <>
//                           Create My Account
//                           <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
//                         </>
//                       )}
//                     </button>

//                     <p className="text-center text-[11px] text-gray-500 mt-3 leading-normal">
//                       By signing up, you agree to our{' '}
//                       <a href="#" className="text-[#9B7EBD] hover:text-[#3B1E54] font-bold underline decoration-[#D4BEE4]">
//                         Terms of Service
//                       </a>{' '}
//                       and{' '}
//                       <a href="#" className="text-[#9B7EBD] hover:text-[#3B1E54] font-bold underline decoration-[#D4BEE4]">
//                         Privacy Policy
//                       </a>
//                     </p>
//                   </motion.div>
//                 </form>
//               </div>

//               {/* Social proof + signin link */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.8 }}
//                 className="mt-4 text-center space-y-2"
//               >
//                 <p className="text-xs text-gray-400">Trusted by singles worldwide</p>
//                 <div className="flex items-center justify-center gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     <span key={i} className="text-pink-400 text-sm">★</span>
//                   ))}
//                   <span className="text-[11px] text-gray-400 ml-1">(4.9/5 from 50K+ reviews)</span>
//                 </div>
//                 <p className="text-sm text-gray-600 pt-2">
//                   Already have an account?{' '}
//                   <Link to="/signin" className="font-semibold text-pink-700 hover:text-pink-800 transition-colors">
//                     Sign In
//                   </Link>
//                 </p>
//               </motion.div>
//             </motion.div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;




















import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, ArrowRight, Mail, Lock, User, Phone, Sparkles, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import API from '../api/axios';

/* ── Decorative kolam-inspired motif ──
   Same generated dot-and-petal grid used on the sign-in page, kept as a
   shared visual signature across the auth flow. */
const KolamMotif = ({ className = '', uid }) => {
  const unitId = `kolam-unit-${uid}`;
  const cells = Array.from({ length: 5 }).flatMap((_, row) =>
    Array.from({ length: 5 }).map((_, col) => ({ row, col }))
  );

  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true" focusable="false">
      <defs>
        <g id={unitId}>
          <circle cx="0" cy="0" r="2.4" fill="currentColor" />
          <path
            d="M0,0 C14,-14 14,14 0,28 C-14,14 -14,-14 0,0 Z"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </defs>
      {cells.map(({ row, col }) => (
        <use
          key={`${row}-${col}`}
          href={`#${unitId}`}
          x={col * 48 + 24}
          y={row * 48 + 24}
          transform={`rotate(${(row + col) % 2 ? 45 : 0} ${col * 48 + 24} ${row * 48 + 24})`}
        />
      ))}
    </svg>
  );
};

const SignUpPage = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [completedFields, setCompletedFields] = useState(new Set());
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'onTouched',
  });

  const formData = watch();

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.5,
        delay: shouldReduceMotion ? 0 : i * 0.08,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.6 }}
        className="min-h-screen min-h-[100dvh] bg-[#EEEEEE] flex items-center justify-center p-4 sm:p-8 overflow-hidden relative"
      >
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-16 left-1/3 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-[#D4BEE4]/45 blur-3xl" />
          <div className="absolute bottom-28 right-1/4 w-52 sm:w-72 h-52 sm:h-72 rounded-full bg-[#9B7EBD]/25 blur-3xl" />
        </div>
        <KolamMotif
          uid="success"
          className="hidden sm:block absolute -bottom-8 -right-8 w-40 h-40 lg:w-56 lg:h-56 text-[#3B1E54] opacity-[0.07] pointer-events-none"
        />

        <div className="relative z-10 max-w-2xl text-center px-2">
          <motion.div
            initial={{ scale: shouldReduceMotion ? 1 : 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: shouldReduceMotion ? 0 : 0.2 }}
            className="mb-6 sm:mb-8 inline-block"
          >
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4BEE4]/60 to-white rounded-full" />
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-[#3B1E54]" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.4 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3B1E54] mb-3 leading-tight"
          >
            Welcome to Your Journey!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.5 }}
            className="text-base sm:text-lg lg:text-xl text-slate-600 mb-8 sm:mb-12 leading-relaxed max-w-lg mx-auto"
          >
            Your account has been created successfully. Now discover meaningful connections and find your perfect match.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8"
          >
            <button
              onClick={() => navigate('/signin')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#3B1E54] hover:bg-[#2c1640] text-white rounded-xl sm:rounded-full font-semibold hover:shadow-2xl hover:shadow-[#3B1E54]/30 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B7EBD]"
            >
              Continue to Sign In <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-slate-200 text-slate-900 rounded-xl sm:rounded-full font-semibold hover:bg-slate-50 hover:border-[#D4BEE4] transition-all duration-300 active:scale-[0.98] text-sm sm:text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B7EBD]"
            >
              Back to Home
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.8 }}
            className="flex justify-center items-center gap-2"
          >
            <Sparkles
              size={18}
              className="text-[#9B7EBD]"
              style={shouldReduceMotion ? undefined : { animation: 'spin 3s linear infinite' }}
            />
            <p className="text-xs sm:text-sm text-slate-500">Redirecting to sign in...</p>
          </motion.div>
        </div>
      </motion.div>
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

  const nameFields = inputFieldConfig.slice(0, 2);
  const otherFields = inputFieldConfig.slice(2);

  const renderField = (field, idx) => {
    const Icon = field.icon;
    const isPassword = field.name === 'password';
    const isCompleted = completedFields.has(field.name);
    const isFocused = focusedField === field.name;
    const hasError = errors[field.name];

    return (
      <motion.div key={field.name} custom={idx} variants={fadeUp} initial="hidden" animate="visible">
        <label htmlFor={field.name} className="block text-xs font-bold text-[#3B1E54] mb-1 ml-1 uppercase tracking-wide">
          {field.label}
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#9B7EBD] transition-colors duration-300 pointer-events-none">
            <Icon size={18} />
          </div>
          <input
            id={field.name}
            type={isPassword ? (showPassword ? 'text' : 'password') : field.type}
            autoComplete={isPassword ? 'new-password' : field.name === 'email' ? 'email' : 'on'}
            {...register(field.name, field.rules)}
            onFocus={() => setFocusedField(field.name)}
            onBlur={() => handleFieldBlur(field.name)}
            placeholder={field.placeholder}
            className={`w-full pl-11 pr-11 py-2.5 rounded-xl border-2 transition-all duration-300 outline-none font-medium text-slate-900 text-sm placeholder-slate-400 ${
              hasError
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/20'
                : isFocused
                  ? 'border-[#9B7EBD] focus:ring-2 focus:ring-[#D4BEE4]/40 bg-white shadow-md'
                  : isCompleted
                    ? 'border-green-200 bg-green-50/20'
                    : 'border-slate-200 hover:border-[#D4BEE4] bg-slate-50/30'
            }`}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#3B1E54] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B7EBD] rounded"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : (
            isCompleted &&
            !hasError && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                <CheckCircle size={18} className="fill-green-100" />
              </div>
            )
          )}
        </div>
        {hasError && <p className="text-[11px] text-red-500 mt-1 ml-1 font-semibold">{hasError.message}</p>}
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-[#EEEEEE] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -right-16 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[#D4BEE4]/45 blur-3xl" />
        <div className="absolute -bottom-36 -left-20 w-72 h-72 sm:w-[26rem] sm:h-[26rem] rounded-full bg-[#9B7EBD]/25 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 w-60 h-60 rounded-full bg-[#6A3E8C]/10 blur-3xl" />
      </div>

      {/* Kolam motifs — hidden on small phones to keep things calm */}
      <KolamMotif
        uid="tr"
        className="hidden sm:block absolute -top-4 -right-4 w-36 h-36 lg:w-52 lg:h-52 text-[#3B1E54] opacity-[0.07] pointer-events-none"
      />
      <KolamMotif
        uid="bl"
        className="hidden sm:block absolute -bottom-8 -left-8 w-36 h-36 lg:w-52 lg:h-52 text-[#9B7EBD] opacity-[0.09] pointer-events-none rotate-45"
      />

      <div className="relative z-10 flex min-h-screen min-h-[100dvh] items-stretch lg:items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 lg:items-center">

            {/* ─── Form (shows first on mobile) ─── */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.5 }}
              className="lg:col-span-6 order-1 pt-12 lg:order-2 w-full max-w-md sm:max-w-xl mx-auto"
            >
              <div className="rounded-3xl border border-[#D4BEE4]/50 bg-white/85 backdrop-blur-xl shadow-xl shadow-[#3B1E54]/10 p-5 sm:p-8 md:p-10">
                {/* Brand mark on mobile only */}
                <div className="lg:hidden text-center mb-5">
                  <Link to="/" className="font-display text-lg font-bold text-[#3B1E54] inline-block">
                    JOD <span className="text-[#9B7EBD]">Matrimony</span>
                  </Link>
                </div>

                <div className="mb-6">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#3B1E54] mb-1">Create Your Account</h2>
                  <p className="text-sm text-slate-500">Join thousands finding love today</p>
                </div>

                {serverError && (
                  <motion.div
                    role="alert"
                    aria-live="polite"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200"
                  >
                    <AlertCircle size={20} className="text-rose-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-600 font-medium">{serverError}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* First / Last name side by side from sm upward */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {nameFields.map((field, idx) => renderField(field, idx))}
                  </div>

                  {otherFields.map((field, idx) => renderField(field, idx + 2))}

                  {/* Gender Select */}
                  <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
                    <label htmlFor="gender" className="block text-xs font-bold text-[#3B1E54] mb-1 ml-1 uppercase tracking-wide">
                      Gender
                    </label>
                    <select
                      id="gender"
                      {...register('gender', { required: 'Please select your gender' })}
                      onFocus={() => setFocusedField('gender')}
                      onBlur={() => handleFieldBlur('gender')}
                      className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-300 outline-none font-medium text-slate-900 text-sm ${
                        errors.gender
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/20'
                          : focusedField === 'gender'
                            ? 'border-[#9B7EBD] focus:ring-2 focus:ring-[#D4BEE4]/40 bg-white shadow-md'
                            : completedFields.has('gender')
                              ? 'border-green-200 bg-green-50/20'
                              : 'border-slate-200 hover:border-[#D4BEE4] bg-slate-50/30'
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-[11px] text-red-500 mt-1 ml-1 font-semibold">{errors.gender.message}</p>
                    )}
                  </motion.div>

                  {/* Footer */}
                  <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full min-h-[3rem] py-3 bg-[#3B1E54] hover:bg-[#2c1640] active:scale-[0.99] text-white rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B7EBD]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create My Account
                          <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-slate-500 mt-3 leading-normal">
                      By signing up, you agree to our{' '}
                      <a href="#" className="text-[#6A3E8C] hover:text-[#3B1E54] font-bold underline decoration-[#D4BEE4]">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-[#6A3E8C] hover:text-[#3B1E54] font-bold underline decoration-[#D4BEE4]">
                        Privacy Policy
                      </a>
                    </p>
                  </motion.div>
                </form>
              </div>

              {/* Social proof + signin link */}
              <div className="mt-4 text-center space-y-2">
                <p className="text-xs text-slate-400">Trusted by families across India</p>
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                  <span className="text-[11px] text-slate-400 ml-1">(4.9/5 from 50K+ reviews)</span>
                </div>
                <p className="text-sm text-slate-600 pt-2">
                  Already have an account?{' '}
                  <Link to="/signin" className="font-semibold text-[#6A3E8C] hover:text-[#3B1E54] transition-colors">
                    Sign In
                  </Link>
                </p>
              </div>
            </motion.div>

            {/* ─── Left Side / Brand panel ─── */}
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-6 lg:space-y-8 text-center lg:text-left max-w-md mx-auto lg:max-w-none">
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#3B1E54] bg-[#D4BEE4]/40 px-4 py-1.5 rounded-full">
                  <Sparkles size={13} className="text-[#9B7EBD]" />
                  Find Love, Build Trust
                </span>
                <h1 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-bold leading-tight text-[#3B1E54] tracking-tight">
                  Discover Your{' '}
                  <span className="block sm:inline bg-gradient-to-r from-[#3B1E54] via-[#6A3E8C] to-[#9B7EBD] bg-clip-text text-transparent">
                    Perfect Match
                  </span>
                </h1>
              </motion.div>

              <motion.p
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-base sm:text-lg text-slate-600 leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-md"
              >
                Join thousands of families looking for meaningful relationships. Our verified profiles and smart matching help you find someone truly compatible.
              </motion.p>

              <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5 lg:gap-4 pt-2"
              >
                <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left gap-2.5 lg:gap-4">
                  <div className="w-10 h-10 bg-[#D4BEE4]/40 rounded-xl flex items-center justify-center flex-shrink-0 text-[#3B1E54]">
                    <Heart size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#3B1E54] text-sm sm:text-base">Verified Profiles</h3>
                    <p className="text-xs sm:text-sm text-slate-600">100% genuine members with photo verification</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left gap-2.5 lg:gap-4">
                  <div className="w-10 h-10 bg-[#D4BEE4]/40 rounded-xl flex items-center justify-center flex-shrink-0 text-[#3B1E54]">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#3B1E54] text-sm sm:text-base">Smart Matching</h3>
                    <p className="text-xs sm:text-sm text-slate-600">Compatibility scoring based on your preferences</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-[#D4BEE4]/50 mx-auto lg:mx-0 max-w-sm lg:max-w-md"
              >
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-[#3B1E54]">50K+</p>
                  <p className="text-xs sm:text-sm text-slate-500">Success Stories</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-[#3B1E54]">10M+</p>
                  <p className="text-xs sm:text-sm text-slate-500">Active Members</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-[#3B1E54]">99%</p>
                  <p className="text-xs sm:text-sm text-slate-500">Verified Users</p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;