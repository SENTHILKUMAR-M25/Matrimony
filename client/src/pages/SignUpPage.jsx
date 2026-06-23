import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, handleSubmit, trigger, formState: { errors }, watch } = useForm({
    mode: 'onTouched'
  });

  const password = watch('password');

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    setIsSuccess(true);
  };

  const nextStep = async () => {
    // Validate current step fields
    let fieldsToValidate = [];
    if (step === 1) fieldsToValidate = ['firstName', 'lastName', 'gender', 'dob', 'mobile', 'email'];
    if (step === 2) fieldsToValidate = ['religion', 'community', 'motherTongue', 'maritalStatus'];
    if (step === 3) fieldsToValidate = ['education', 'occupation', 'income'];
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-10 rounded-2xl shadow-premium max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile Created Successfully</h2>
          <p className="text-gray-600 mb-8">Welcome to JOD Matrimony! Your journey to find the perfect partner begins now.</p>
          <Link to="/signin" className="btn-primary w-full justify-center">
            Continue to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-display font-bold text-maroon-800 inline-block mb-2">JOD Matrimony</Link>
          <h2 className="text-2xl font-bold text-gray-900">Create Your Profile</h2>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2 px-1">
            <span className={step >= 1 ? 'text-maroon-700' : ''}>Basic</span>
            <span className={step >= 2 ? 'text-maroon-700' : ''}>Personal</span>
            <span className={step >= 3 ? 'text-maroon-700' : ''}>Career</span>
            <span className={step >= 4 ? 'text-maroon-700' : ''}>Account</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-maroon-600 h-2 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white py-8 px-4 shadow-premium sm:rounded-2xl sm:px-10 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* STEP 1: Basic Details */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in-up">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Basic Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" {...register('firstName', { required: 'Required' })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-500 outline-none" />
                    {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" {...register('lastName', { required: 'Required' })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-500 outline-none" />
                    {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select {...register('gender', { required: 'Required' })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-500 outline-none">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {errors.gender && <span className="text-xs text-red-500">{errors.gender.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input type="date" {...register('dob', { required: 'Required' })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-500 outline-none" />
                    {errors.dob && <span className="text-xs text-red-500">{errors.dob.message}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input type="tel" {...register('mobile', { required: 'Required', pattern: { value: /^[0-9]{10}$/, message: 'Invalid number' } })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-500 outline-none" />
                  {errors.mobile && <span className="text-xs text-red-500">{errors.mobile.message}</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-500 outline-none" />
                  {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                </div>
              </div>
            )}

            {/* STEP 2: Personal Details */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in-up">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Personal Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                    <select {...register('religion', { required: 'Required' })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-500 outline-none">
                      <option value="">Select</option>
                      <option value="hindu">Hindu</option>
                      <option value="muslim">Muslim</option>
                      <option value="christian">Christian</option>
                      <option value="sikh">Sikh</option>
                    </select>
                    {errors.religion && <span className="text-xs text-red-500">{errors.religion.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Community</label>
                    <select {...register('community', { required: 'Required' })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-500 outline-none">
                      <option value="">Select</option>
                      <option value="brahmin">Brahmin</option>
                      <option value="rajput">Rajput</option>
                      <option value="yadav">Yadav</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.community && <span className="text-xs text-red-500">{errors.community.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mother Tongue</label>
                    <select {...register('motherTongue', { required: 'Required' })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-500 outline-none">
                      <option value="">Select</option>
                      <option value="hindi">Hindi</option>
                      <option value="tamil">Tamil</option>
                      <option value="telugu">Telugu</option>
                      <option value="english">English</option>
                    </select>
                    {errors.motherTongue && <span className="text-xs text-red-500">{errors.motherTongue.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                    <select {...register('maritalStatus', { required: 'Required' })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-500 outline-none">
                      <option value="">Select</option>
                      <option value="never_married">Never Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                    {errors.maritalStatus && <span className="text-xs text-red-500">{errors.maritalStatus.message}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Education & Career */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in-up">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Education & Career</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Highest Education</label>
                  <select {...register('education', { required: 'Required' })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-500 outline-none">
                    <option value="">Select</option>
                    <option value="bachelors">Bachelors</option>
                    <option value="masters">Masters</option>
                    <option value="doctorate">Doctorate</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.education && <span className="text-xs text-red-500">{errors.education.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input type="text" {...register('occupation', { required: 'Required' })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-500 outline-none" placeholder="e.g. Software Engineer" />
                  {errors.occupation && <span className="text-xs text-red-500">{errors.occupation.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
                  <select {...register('income', { required: 'Required' })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-500 outline-none">
                    <option value="">Select</option>
                    <option value="0-5">0 - 5 Lakhs</option>
                    <option value="5-10">5 - 10 Lakhs</option>
                    <option value="10-20">10 - 20 Lakhs</option>
                    <option value="20+">20+ Lakhs</option>
                  </select>
                  {errors.income && <span className="text-xs text-red-500">{errors.income.message}</span>}
                </div>
              </div>
            )}

            {/* STEP 4: Account Setup */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in-up">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Account Setup</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-500 outline-none" />
                  {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input type="password" {...register('confirmPassword', { 
                    required: 'Required',
                    validate: value => value === password || "Passwords don't match"
                  })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-maroon-500 outline-none" />
                  {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
                </div>
                <div className="flex items-start mt-4">
                  <div className="flex items-center h-5">
                    <input id="terms" type="checkbox" {...register('terms', { required: 'You must accept the T&C' })} className="w-4 h-4 text-maroon-600 border-gray-300 rounded focus:ring-maroon-500" />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-600">
                      I agree to the <a href="#" className="font-medium text-maroon-700 hover:underline">Terms & Conditions</a> and Privacy Policy.
                    </label>
                    {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t mt-8">
              {step > 1 ? (
                <button type="button" onClick={prevStep} className="btn-outline !py-2 !px-6 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 before:!hidden shadow-none">
                  Previous
                </button>
              ) : <div></div>}

              {step < 4 ? (
                <button type="button" onClick={nextStep} className="btn-primary !py-2 !px-8">
                  Next
                </button>
              ) : (
                <button type="submit" className="btn-primary !py-2 !px-8">
                  Create Account
                </button>
              )}
            </div>
          </form>
          
          {step === 1 && (
            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="font-semibold text-maroon-700 hover:text-maroon-800">
                Sign In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
