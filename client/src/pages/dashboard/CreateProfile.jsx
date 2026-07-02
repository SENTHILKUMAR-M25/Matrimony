import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  User, Calendar, BookOpen, Briefcase, MapPin, Heart, 
  CheckCircle, Check, UploadCloud, X, Users, Image as ImageIcon,
  Ruler, Scale, Languages, Globe, Building, IndianRupee,
  Star, Clock, Upload, Plus, Minus, ChevronDown, CheckCircle2 
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import API from '../../api/axios';
import HoroscopeModule from '../../components/horoscope/HoroscopeModule';
import { parseHoroscopeData } from '../../constants/horoscope';

// ─── Static options ───
const MARITAL_STATUS_OPTIONS = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];
const RELIGION_OPTIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Parsi', 'Jewish', 'Other'];
const MOTHER_TONGUE_OPTIONS = ['Tamil', 'Telugu', 'Hindi', 'Malayalam', 'Kannada', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Urdu', 'Odia', 'English'];
const GOTHRAM_OPTIONS = [
  'Angirasa', 'Atri', 'Bharadwaja', 'Bhrigu', 'Dadhyancha', 'Dhananjaya',
  'Garga', 'Gautama', 'Harita', 'Jamadagni', 'Kashyapa', 'Katya',
  'Kaushika', 'Kutsa', 'Maitreya', 'Manava', 'Markandeya', 'Mudgala',
  'Naidhruva', 'Parashara', 'Pulaha', 'Pulastya', 'Shandilya', 'Savarna',
  'Shounaka', 'Srivatsa', 'Upamanyu', 'Vasishta', 'Vathsa', 'Vishwamitra',
  'Yaska', 'Others',
];
const DHOSHAM_OPTIONS = ['None', 'Manglik / Chevvai Dhosham', 'Sarpa Dhosham', 'Naga Dhosham', 'Kuja Dhosham', 'Kala Sarpa Dhosham', 'Pitra Dhosham', 'Bhauma Dhosham', 'Others'];
const LAKNAM_OPTIONS = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];

// ─── Location hierarchy: Country → State → District → City ───
const LOCATION_DATA = {
  'India': {
    'Andhra Pradesh': { 'Anantapur': ['Anantapur', 'Guntakal', 'Hindupur'], 'Chittoor': ['Chittoor', 'Tirupati', 'Madanapalle'], 'East Godavari': ['Rajahmundry', 'Kakinada', 'Amalapuram'], 'Guntur': ['Guntur', 'Tenali', 'Mangalagiri'], 'Krishna': ['Vijayawada', 'Machilipatnam', 'Nandigama'], 'Kurnool': ['Kurnool', 'Nandyal', 'Adoni'], 'Nellore': ['Nellore', 'Gudur', 'Kavali'], 'Prakasam': ['Ongole', 'Markapur', 'Chirala'], 'Srikakulam': ['Srikakulam', 'Palasa', 'Ichapuram'], 'Visakhapatnam': ['Visakhapatnam', 'Vizianagaram', 'Anakapalli'], 'West Godavari': ['Eluru', 'Bhimavaram', 'Palakollu'] },
    'Delhi': { 'Central Delhi': ['Chandni Chowk', 'Daryaganj', 'Karol Bagh'], 'East Delhi': ['Preet Vihar', 'Shahdara', 'Laxmi Nagar'], 'New Delhi': ['New Delhi City', 'Chanakyapuri', 'Connaught Place'], 'North Delhi': ['Model Town', 'Alipur', 'Rohini'], 'North East Delhi': ['Yamuna Vihar', 'Seelampur', 'Karawal Nagar'], 'South Delhi': ['Saket', 'Hauz Khas', 'Green Park'], 'South West Delhi': ['Dwarka', 'Janakpuri', 'Najafgarh'], 'West Delhi': ['Rajouri Garden', 'Punjabi Bagh', 'Tilak Nagar'] },
    'Karnataka': { 'Bagalkot': ['Bagalkot', 'Jamkhandi', 'Mudhol'], 'Bangalore Urban': ['Bangalore City', 'Yelahanka', 'Anekal'], 'Belgaum': ['Belgaum', 'Gokak', 'Khanapur'], 'Bellary': ['Bellary', 'Hospet', 'Siruguppa'], 'Chikkaballapur': ['Chikkaballapur', 'Chintamani', 'Gowribidanur'], 'Dakshina Kannada': ['Mangalore', 'Puttur', 'Bantwal'], 'Davangere': ['Davangere', 'Harihar', 'Channagiri'], 'Dharwad': ['Hubli', 'Dharwad', 'Kalghatgi'], 'Hassan': ['Hassan', 'Arsikere', 'Holenarasipur'], 'Kolar': ['Kolar', 'Bangarapet', 'Malur'], 'Mandya': ['Mandya', 'Srirangapatna', 'Pandavapura'], 'Mysore': ['Mysore City', 'Nanjanagud', 'K R Nagar'], 'Shivamogga': ['Shivamogga', 'Bhadravati', 'Shikaripura'], 'Tumkur': ['Tumkur', 'Tiptur', 'Kunigal'], 'Udupi': ['Udupi', 'Kundapura', 'Karkala'] },
    'Kerala': { 'Alappuzha': ['Alappuzha', 'Chengannur', 'Cherthala'], 'Ernakulam': ['Kochi', 'Aluva', 'Muvattupuzha'], 'Idukki': ['Idukki', 'Kattappana', 'Thodupuzha'], 'Kannur': ['Kannur', 'Thalassery', 'Payyanur'], 'Kasaragod': ['Kasaragod', 'Kanhangad', 'Manjeshwar'], 'Kollam': ['Kollam', 'Karunagappally', 'Punalur'], 'Kottayam': ['Kottayam', 'Changanassery', 'Palai'], 'Kozhikode': ['Kozhikode City', 'Vadakara', 'Koyilandy'], 'Malappuram': ['Malappuram', 'Ponnani', 'Tirur'], 'Palakkad': ['Palakkad', 'Ottapalam', 'Mannarkkad'], 'Pathanamthitta': ['Pathanamthitta', 'Adoor', 'Ranni'], 'Thiruvananthapuram': ['Thiruvananthapuram City', 'Neyyattinkara', 'Nedumangad'], 'Thrissur': ['Thrissur', 'Irinjalakuda', 'Chalakudy'], 'Wayanad': ['Sultan Bathery', 'Mananthavady', 'Vythiri'] },
    'Maharashtra': { 'Ahmednagar': ['Ahmednagar', 'Shirdi', 'Shrirampur'], 'Akola': ['Akola', 'Akot', 'Balapur'], 'Amravati': ['Amravati City', 'Chandur', 'Achalpur'], 'Aurangabad': ['Aurangabad', 'Paithan', 'Sillod'], 'Mumbai City': ['Mumbai City', 'Colaba', 'Andheri'], 'Mumbai Suburban': ['Bandra', 'Borivali', 'Kurla'], 'Nagpur': ['Nagpur', 'Ramtek', 'Umred'], 'Nashik': ['Nashik', 'Malegaon', 'Manmad'], 'Pune': ['Pune City', 'Pimpri-Chinchwad', 'Shivajinagar'], 'Thane': ['Thane', 'Kalyan-Dombivli', 'Navi Mumbai'] },
    'Tamil Nadu': { 'Ariyalur': ['Ariyalur', 'Jayankondam', 'Udayarpalayam'], 'Chennai': ['Chennai Central', 'Chennai South', 'Chennai North'], 'Coimbatore': ['Coimbatore North', 'Coimbatore South', 'Pollachi'], 'Cuddalore': ['Cuddalore', 'Chidambaram', 'Panruti'], 'Dharmapuri': ['Dharmapuri', 'Harur', 'Palacode'], 'Dindigul': ['Dindigul', 'Palani', 'Kodaikanal'], 'Erode': ['Erode', 'Gobichettipalayam', 'Bhavani'], 'Kallakurichi': ['Kallakurichi', 'Sankarapuram', 'Ulundurpettai'], 'Kanchipuram': ['Kanchipuram', 'Sriperumbudur', 'Uthiramerur'], 'Kanyakumari': ['Nagercoil', 'Thiruvattar', 'Kulasekaram'], 'Karur': ['Karur', 'Kulithalai', 'Kadavur'], 'Krishnagiri': ['Krishnagiri', 'Hosur', 'Uthangarai'], 'Madurai': ['Madurai City', 'Madurai South', 'Usilampatti'], 'Mayiladuthurai': ['Mayiladuthurai', 'Sirkazhi', 'Tharangambadi'], 'Nagapattinam': ['Nagapattinam', 'Vedaranyam', 'Thirukkuvalai'], 'Namakkal': ['Namakkal', 'Tiruchengode', 'Rasipuram'], 'Nilgiris': ['Ooty', 'Coonoor', 'Gudalur'], 'Perambalur': ['Perambalur', 'Kunnam', 'Veppanthattai'], 'Pudukkottai': ['Pudukkottai', 'Aranthangi', 'Thirumayam'], 'Ramanathapuram': ['Ramanathapuram', 'Paramakudi', 'Rameswaram'], 'Ranipet': ['Ranipet', 'Walajapet', 'Arakkonam'], 'Salem': ['Salem', 'Attur', 'Mettur'], 'Sivaganga': ['Sivaganga', 'Manamadurai', 'Karaikudi'], 'Tenkasi': ['Tenkasi', 'Sankarankovil', 'Puliyangudi'], 'Thanjavur': ['Thanjavur', 'Kumbakonam', 'Pattukkottai'], 'Theni': ['Theni', 'Bodi', 'Periyakulam'], 'Thoothukudi': ['Thoothukudi', 'Tirunelveli', 'Srivilliputhur'], 'Tiruchirappalli': ['Tiruchirappalli', 'Lalgudi', 'Thuraiyur'], 'Tirunelveli': ['Tirunelveli City', 'Ambasamudram', 'Tenkasi'], 'Tirupathur': ['Tirupathur', 'Vaniyambadi', 'Ambur'], 'Tiruppur': ['Tiruppur', 'Dharapuram', 'Udumalaipettai'], 'Tiruvallur': ['Tiruvallur', 'Avadi', 'Poonamallee'], 'Tiruvannamalai': ['Tiruvannamalai', 'Arani', 'Chengam'], 'Tiruvarur': ['Tiruvarur', 'Mannargudi', 'Needamangalam'], 'Vellore': ['Vellore', 'Gudiyattam', 'Katpadi'], 'Viluppuram': ['Viluppuram', 'Tindivanam', 'Gingee'], 'Virudhunagar': ['Virudhunagar', 'Sivakasi', 'Rajapalayam'] },
    'Telangana': { 'Adilabad': ['Adilabad', 'Kagaznagar', 'Nirmal'], 'Hyderabad': ['Hyderabad City', 'Secunderabad', 'Ranga Reddy'], 'Karimnagar': ['Karimnagar', 'Pedda Ranga Reddy', 'Jagtial'], 'Khammam': ['Khammam', 'Sathupally', 'Kothagudem'], 'Mahabubnagar': ['Mahabubnagar', 'Wanaparthy', 'Nagarkurnool'], 'Medak': ['Medak', 'Siddipet', 'Sangareddy'], 'Nalgonda': ['Nalgonda', 'Suryapet', 'Miryalaguda'], 'Nizamabad': ['Nizamabad', 'Bodhan', 'Armoor'], 'Warangal': ['Warangal', 'Hanamkonda', 'Jangaon'] },
  },
  'USA': {
    'California': { 'Los Angeles': ['Los Angeles City', 'Long Beach', 'Santa Clarita'], 'San Francisco Bay': ['San Francisco', 'Oakland', 'San Jose'], 'San Diego': ['San Diego City', 'Chula Vista', 'Oceanside'] },
    'New York': { 'New York City': ['Manhattan', 'Brooklyn', 'Queens'], 'Buffalo': ['Buffalo City', 'Niagara Falls', 'Tonawanda'] },
    'Texas': { 'Houston': ['Houston City', 'Sugar Land', 'Pearland'], 'Dallas': ['Dallas City', 'Fort Worth', 'Arlington'] },
    'Illinois': { 'Chicago': ['Chicago City', 'Naperville', 'Aurora'] },
    'New Jersey': { 'Edison': ['Edison', 'Woodbridge', 'Iselin'], 'Jersey City': ['Jersey City', 'Hoboken', 'Bayonne'] },
  },
  'UK': {
    'England': { 'Greater London': ['London', 'Brent', 'Croydon'], 'Manchester': ['Manchester City', 'Salford', 'Stockport'], 'Birmingham': ['Birmingham City', 'Solihull', 'Wolverhampton'], 'Leicester': ['Leicester City', 'Oadby', 'Loughborough'] },
    'Scotland': { 'Glasgow': ['Glasgow City', 'Paisley', 'East Kilbride'], 'Edinburgh': ['Edinburgh City', 'Musselburgh', 'Dalkeith'] },
  },
  'Canada': {
    'Ontario': { 'Toronto': ['Toronto City', 'Scarborough', 'Mississauga'], 'Ottawa': ['Ottawa City', 'Nepean', 'Orleans'] },
    'British Columbia': { 'Vancouver': ['Vancouver City', 'Surrey', 'Burnaby'] },
  },
  'Australia': {
    'New South Wales': { 'Sydney': ['Sydney City', 'Parramatta', 'Liverpool'] },
    'Victoria': { 'Melbourne': ['Melbourne City', 'Geelong', 'Ballarat'] },
    'Queensland': { 'Brisbane': ['Brisbane City', 'Gold Coast', 'Sunshine Coast'] },
  },
  'UAE': {
    'Dubai': { 'Dubai City': ['Bur Dubai', 'Deira', 'Dubai Marina'] },
    'Abu Dhabi': { 'Abu Dhabi City': ['Abu Dhabi', 'Al Ain', 'Al Gharbia'] },
    'Sharjah': { 'Sharjah City': ['Sharjah', 'Al Majaz', 'Al Khan'] },
  },
  'Singapore': {
    'Singapore': { 'Singapore City': ['Central Area', 'Woodlands', 'Tampines', 'Jurong'] },
  },
};

// ─── Caste → Sub Caste mapping ───
const CASTE_SUBCASTE_MAP = {
  'Brahmin': ['Iyer', 'Iyengar', 'Smartha', 'Madhwa', 'Namboodiri', 'Hoysala', 'Others'],
  'Kshatriya': ['Rajput', 'Maratha', 'Thakur', 'Kshatriya', 'Others'],
  'Vaishya': ['Chettiar', 'Vysya', 'Baniya', 'Komati', 'Agarwal', 'Oswal', 'Mahajan', 'Others'],
  'Shudra': ['Mudaliar', 'Pillai', 'Reddy', 'Naidu', 'Gounder', 'Nadar', 'Vanniyar', 'Thevar', 'Yadav', 'Viswakarma', 'Ezhava', 'Vokkaliga', 'Lingayat', 'Kamma', 'Others'],
  'Scheduled Caste': ['Adi Dravida', 'Paraiyar', 'Pallar', 'Chakkiliyar', 'Arunthathiyar', 'Mala', 'Madiga', 'Others'],
  'Scheduled Tribe': ['Badaga', 'Kota', 'Toda', 'Irula', 'Kurumba', 'Others'],
  'Others': ['Others'],
};

// ─── Rasi → Nakshatra mapping (Vedic astrology) ───
const RASI_NAKSHATRA_MAP = {
  'Mesha (Aries)': ['Ashwini', 'Bharani', 'Krittika'],
  'Vrishabha (Taurus)': ['Krittika', 'Rohini', 'Mrigashira'],
  'Mithuna (Gemini)': ['Mrigashira', 'Ardra', 'Punarvasu'],
  'Karka (Cancer)': ['Punarvasu', 'Pushya', 'Ashlesha'],
  'Simha (Leo)': ['Magha', 'Purva Phalguni', 'Uttara Phalguni'],
  'Kanya (Virgo)': ['Uttara Phalguni', 'Hasta', 'Chitra'],
  'Tula (Libra)': ['Chitra', 'Swati', 'Vishakha'],
  'Vrishchika (Scorpio)': ['Vishakha', 'Anuradha', 'Jyeshtha'],
  'Dhanu (Sagittarius)': ['Mula', 'Purva Ashadha', 'Uttara Ashadha'],
  'Makara (Capricorn)': ['Uttara Ashadha', 'Shravana', 'Dhanishtha'],
  'Kumbha (Aquarius)': ['Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada'],
  'Meena (Pisces)': ['Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'],
};

const RASI_OPTIONS = Object.keys(RASI_NAKSHATRA_MAP);
const NAKSHATRA_OPTIONS = [...new Set(Object.values(RASI_NAKSHATRA_MAP).flat())];
const CASTE_OPTIONS = Object.keys(CASTE_SUBCASTE_MAP);
const COUNTRY_OPTIONS = Object.keys(LOCATION_DATA);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ─── Nakshatra → Lagnam compatibility map (based on Vedic pada division) ──
const NAKSHATRA_LAGNAM_MAP = {
  'Ashwini': ['Mesha'],
  'Bharani': ['Mesha'],
  'Krittika': ['Mesha', 'Vrishabha'],
  'Rohini': ['Vrishabha'],
  'Mrigashira': ['Vrishabha', 'Mithuna'],
  'Ardra': ['Mithuna'],
  'Punarvasu': ['Mithuna', 'Karka'],
  'Pushya': ['Karka'],
  'Ashlesha': ['Karka'],
  'Magha': ['Simha'],
  'Purva Phalguni': ['Simha'],
  'Uttara Phalguni': ['Simha', 'Kanya'],
  'Hasta': ['Kanya'],
  'Chitra': ['Kanya', 'Tula'],
  'Swati': ['Tula'],
  'Vishakha': ['Tula', 'Vrishchika'],
  'Anuradha': ['Vrishchika'],
  'Jyeshtha': ['Vrishchika'],
  'Mula': ['Dhanu'],
  'Purva Ashadha': ['Dhanu'],
  'Uttara Ashadha': ['Dhanu', 'Makara'],
  'Shravana': ['Makara'],
  'Dhanishtha': ['Makara', 'Kumbha'],
  'Shatabhisha': ['Kumbha'],
  'Purva Bhadrapada': ['Kumbha', 'Meena'],
  'Uttara Bhadrapada': ['Meena'],
  'Revati': ['Meena'],
};

// ─── Derived helpers ───
const getStates = (country) => country && LOCATION_DATA[country] ? Object.keys(LOCATION_DATA[country]) : [];
const getDistricts = (country, state) => (country && state && LOCATION_DATA[country]?.[state] ? Object.keys(LOCATION_DATA[country][state]) : []);
const getCities = (country, state, district) => (country && state && district ? (LOCATION_DATA[country]?.[state]?.[district] || []) : []);
const getSubCastes = (caste) => (caste && CASTE_SUBCASTE_MAP[caste] ? CASTE_SUBCASTE_MAP[caste] : []);
const getNakshatras = (rasi) => (rasi && RASI_NAKSHATRA_MAP[rasi] ? RASI_NAKSHATRA_MAP[rasi] : []);
const getFilteredNakshatras = (selectedRasis) => {
  const arr = Array.isArray(selectedRasis) ? selectedRasis : [];
  if (arr.length === 0) return NAKSHATRA_OPTIONS;
  const rasiNames = arr.map((r) => (r || '').replace(/ \(.*\)$/, '').trim()).filter(Boolean);
  const set = new Set();
  rasiNames.forEach((rasi) => {
    Object.entries(RASI_NAKSHATRA_MAP).forEach(([key, naks]) => {
      if (key.startsWith(rasi)) naks.forEach((n) => set.add(n));
    });
  });
  return [...set];
};
const getFilteredLagnams = (selectedNakshatras) => {
  const arr = Array.isArray(selectedNakshatras) ? selectedNakshatras : [];
  if (arr.length === 0) return LAKNAM_OPTIONS;
  const set = new Set();
  arr.forEach((n) => {
    (NAKSHATRA_LAGNAM_MAP[n] || []).forEach((l) => set.add(l));
  });
  return [...set];
};

// Journey sections used by the sticky stepper + scroll-spy
const SECTIONS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'education', label: 'Career', icon: Briefcase },
  { id: 'family', label: 'Family', icon: Users, optional: true },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'astro', label: 'Astro', icon: Star },
  { id: 'preferences', label: 'Preferences', icon: Heart },
  { id: 'photos', label: 'Photos', icon: ImageIcon },
];

const InputField = ({ label, icon: Icon, type = "text", register, name, rules, errors, placeholder }) => (
  <div className="space-y-1.5">
    <label htmlFor={name} className="text-sm font-medium text-black ml-1">
      {label} {rules?.required && <span className="text-pink-500">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-900 group-focus-within:text-pink-400 transition-colors pointer-events-none">
        <Icon size={18} />
      </div>
      <input
        id={name}
        type={type}
        {...register(name, rules)}
        className={`w-full bg-white/[0.04] border ${errors[name] ? 'border-pink-500/70 bg-pink-500/5' : 'border-white/10 hover:border-white/20'} text-black text-sm rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500/60 block p-3.5 pl-11 transition-all duration-200 placeholder-gray-500`}
        placeholder={placeholder}
      />
    </div>
    <AnimatePresence>
      {errors[name] && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-xs text-pink-400 ml-1 flex items-center gap-1"
        >
          <X size={12} /> {errors[name].message}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const SelectField = ({ label, icon: Icon, register, name, rules, errors, options }) => (
  <div className="space-y-1.5 z-10">
    <label htmlFor={name} className="text-sm font-medium text-black ml-1">
      {label} {rules?.required && <span className="text-pink-500">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-400 transition-colors pointer-events-none">
        <Icon size={18} />
      </div>
      <select
        id={name}
        {...register(name, rules)}
        className={`w-full bg-white/[0.04] border ${errors[name] ? 'border-pink-500/70 bg-pink-500/5' : 'border-white/10 hover:border-white/20'} text-black text-sm rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500/60 block p-3.5 pl-11 pr-10 transition-all duration-200 appearance-none`}
      >
        <option value="" className="bg-gray-900 text-gray-500">Select {label}</option>
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-gray-500 text-white">{opt}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-pink-400 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
    <AnimatePresence>
      {errors[name] && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-xs text-pink-400 ml-1 flex items-center gap-1"
        >
          <X size={12} /> {errors[name].message}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

/* ─────────── Controlled Number Input ─────────── */
const NumberInput = ({ label, icon: Icon, value, onChange, name }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-black ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-400 transition-colors pointer-events-none">
        <Icon size={18} />
      </div>
      <input
        type="number"
        min="0"
        max="20"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-gray-300 hover:border-pink-400 text-black text-sm rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500/60 block p-3.5 pl-11 transition-all duration-200"
        placeholder="0"
      />
    </div>
  </div>
);

/* ─────────── Searchable Select (portal-based dropdown) ─────────── */
const SearchableSelect = ({ label, icon: Icon, value, onChange, options, placeholder, error, disabled, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownStyle, setDropdownStyle] = useState({});
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  const filtered = search
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  /* ── close on outside click ── */
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen]);

  /* ── close on scroll / resize ── */
  // useEffect(() => {
  //   if (!isOpen) return;
  //   const handle = () => setIsOpen(false);
  //   window.addEventListener('scroll', handle, true);
  //   window.addEventListener('resize', handle);
  //   return () => {
  //     window.removeEventListener('scroll', handle, true);
  //     window.removeEventListener('resize', handle);
  //   };
  // }, [isOpen]);


  useEffect(() => {
  if (!isOpen) return;

  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  };

  updatePosition();

  window.addEventListener("scroll", updatePosition, true);
  window.addEventListener("resize", updatePosition);

  return () => {
    window.removeEventListener("scroll", updatePosition, true);
    window.removeEventListener("resize", updatePosition);
  };
}, [isOpen]);
  /* ── recalc position and focus search on open ── */
  useEffect(() => {
    if (!isOpen) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setDropdownStyle({
        position: 'fixed',
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: 9999,
      });
    }
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [isOpen]);

  const selectOption = (opt) => {
    onChange(opt);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-black ml-1">
        {label} <span className="text-pink-500">*</span>
      </label>
      <div className="relative group" ref={triggerRef}>
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-400 transition-colors pointer-events-none z-10">
            <Icon size={18} />
          </div>
        )}
        <button
          type="button"
          onClick={() => { if (!disabled) { setIsOpen(!isOpen); setSearch(''); } }}
          disabled={disabled}
          className={`w-full bg-white border ${error ? 'border-pink-500/70 bg-pink-500/5' : 'border-gray-300 hover:border-pink-400'} text-black text-sm rounded-xl focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500/60 block p-3.5 ${Icon ? 'pl-11' : 'pl-4'} pr-10 transition-all duration-200 text-left truncate ${!value ? 'text-gray-400' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
              Loading...
            </span>
          ) : (
            value || placeholder || `Select ${label}`
          )}
        </button>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-pink-400 transition-colors">
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          style={dropdownStyle}
          className="bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 flex flex-col overflow-hidden"
        >
          <div className="p-2 border-b border-gray-100 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 bg-gray-50"
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400">No results found</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => selectOption(opt)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    value === opt
                      ? 'bg-pink-50 text-pink-700 font-medium'
                      : 'text-gray-700 hover:bg-pink-50 hover:text-pink-700'
                  }`}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>,
        document.body
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-pink-500 ml-1 flex items-center gap-1"
          >
            <X size={12} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────── Dependent Select (auto-filters children) ─────────── */
const DependentSelectField = ({ label, icon: Icon, value, onChange, options, parentValue, placeholder, error, disabled, loading }) => {
  useEffect(() => {
    if (parentValue && value && !options.includes(value)) {
      onChange('');
    }
  }, [parentValue]);

  return (
    <SearchableSelect
      label={label}
      icon={Icon}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      error={error}
      disabled={disabled || !parentValue || options.length === 0}
      loading={loading}
    />
  );
};

/* ─────────── Multi-Select Chips (searchable tag picker) ─────────── */
const MultiSelectChips = ({ label, icon: Icon, value, onChange, options, placeholder }) => {
  const chips = Array.isArray(value) ? value : [];
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownStyle, setDropdownStyle] = useState({});
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const menuRef = useRef(null);

  const filtered = search
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    if (!isOpen) return;
    const handle = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) setIsOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handle = () => setIsOpen(false);
    window.addEventListener('scroll', handle, true);
    window.addEventListener('resize', handle);
    return () => { window.removeEventListener('scroll', handle, true); window.removeEventListener('resize', handle); };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setDropdownStyle({
        position: 'fixed',
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${Math.max(rect.width, 280)}px`,
        zIndex: 9999,
      });
    }
    requestAnimationFrame(() => searchRef.current?.focus());
  }, [isOpen]);

  const toggle = (opt) => {
    if (chips.includes(opt)) {
      onChange(chips.filter((v) => v !== opt));
    } else {
      onChange([...chips, opt]);
    }
  };

  const removeChip = (opt) => {
    onChange(chips.filter((v) => v !== opt));
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-black ml-1">
        {label}
      </label>
      <div ref={triggerRef}>
        <div
          className={`relative w-full min-h-[44px] bg-white border border-gray-300 hover:border-pink-400 text-sm rounded-xl px-3 py-1.5 flex flex-wrap gap-1.5 items-center cursor-pointer transition-colors ${
            isOpen ? 'ring-2 ring-pink-500/25 border-pink-500/60' : ''
          }`}
          onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
        >
          {chips.length > 0 ? (
            chips.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-100 text-pink-800 text-xs font-medium"
              >
                {chip}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeChip(chip); }}
                  className="hover:bg-pink-200 rounded-full p-0.5 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400 py-0.5">{placeholder || `Select ${label}`}</span>
          )}
          <ChevronDown size={16} className={`ml-auto text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && createPortal(
        <div ref={menuRef} style={dropdownStyle} className="bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-gray-100 shrink-0">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 bg-gray-50"
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400">No results found</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                    chips.includes(opt)
                      ? 'bg-pink-50 text-pink-700 font-medium'
                      : 'text-gray-700 hover:bg-pink-50 hover:text-pink-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                    chips.includes(opt) ? 'bg-pink-600 border-pink-600' : 'border-gray-300'
                  }`}>
                    {chips.includes(opt) && <Check size={10} className="text-white" />}
                  </div>
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

/* ─────────── Dynamic Sibling Occupation Fields ─────────── */
const SiblingFields = ({ count, prefix, register, errors }) => {
  if (!count || count < 1) return null;
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-pink-700 uppercase tracking-wider">{prefix}s</p>
      {Array.from({ length: count }, (_, i) => (
        <InputField
          key={`${prefix}-${i}`}
          label={`${prefix} ${i + 1} Occupation`}
          name={`${prefix.toLowerCase()}Occupation${i + 1}`}
          icon={Briefcase}
          register={register}
          errors={errors}
          placeholder={`e.g. Engineer, Doctor`}
        />
      ))}
    </div>
  );
};

const SectionCard = ({ id, title, icon: Icon, children, complete, optional }) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className="scroll-mt-44 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20"
  >
    <div className="flex items-center justify-between gap-3 mb-6 border-b border-white/10 pb-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-pink-600/15 rounded-xl text-pink-800 ring-1 ring-pink-500/20">
          <Icon size={22} />
        </div>
        <h2 className="font-display text-xl md:text-2xl font-semibold text-black tracking-tight">{title}</h2>
      </div>
      {optional ? (
        <span className="text-[11px] uppercase tracking-wide text-gray-500 font-medium px-2.5 py-1 rounded-full border border-white/10 shrink-0">
          Optional
        </span>
      ) : (
        <span className={`flex items-center gap-1 text-[11px] uppercase tracking-wide font-medium px-2.5 py-1 rounded-full transition-colors shrink-0 ${
          complete
            ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/30'
            : 'text-gray-500 border border-white/10'
        }`}>
          {complete && <Check size={12} />} {complete ? 'Complete' : 'Required'}
        </span>
      )}
    </div>
    {children}
  </motion.div>
);

const JourneyStepper = ({ activeSection, completion, onNavigate }) => (
  <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
    {SECTIONS.map((s, i) => {
      const isActive = activeSection === s.id;
      const isDone = !s.optional && completion[s.id];
      const Icon = s.icon;
      return (
        <div key={s.id} className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onNavigate(s.id)}
            className="flex items-center gap-2 shrink-0"
          >
            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
              isActive
                ? 'border-pink-500 bg-pink-500/15 ring-2 ring-pink-500/30'
                : isDone
                  ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10'
                  : 'border-white/15 bg-white/5'
            }`}>
              {isDone && !isActive ? (
                <Check size={14} className="text-[#D4AF37]" />
              ) : (
                <Icon size={14} className={isActive ? 'text-pink-300' : 'text-gray-400'} />
              )}
            </div>
            <span className={`text-xs font-medium whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-500'}`}>
              {s.label}
            </span>
          </button>
          {i < SECTIONS.length - 1 && <div className="w-5 h-px bg-white/10 mx-2" />}
        </div>
      );
    })}
  </div>
);

const CreateProfile = () => {
  const { user, token, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('personal');

  // Photo states
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [additionalPhotos, setAdditionalPhotos] = useState([]);
  const [additionalPhotosPreview, setAdditionalPhotosPreview] = useState([]);
  const [isDraggingProfile, setIsDraggingProfile] = useState(false);
  const [isDraggingAdditional, setIsDraggingAdditional] = useState(false);

  // Horoscope structured data
  const [horoscopeData, setHoroscopeData] = useState(() =>
    parseHoroscopeData(user?.horoscopeData)
  );

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      age: user?.age || '',
      height: user?.height || '',
      weight: user?.weight || '',
      maritalStatus: user?.maritalStatus || '',
      religion: user?.religion || '',
      caste: user?.caste || '',
      subCaste: user?.subCaste || '',
      motherTongue: user?.motherTongue || '',
      
      education: user?.education || '',
      occupation: user?.occupation || '',
      companyName: user?.companyName || '',
      annualIncome: user?.annualIncome || '',
      
      fatherName: user?.fatherName || '',
      motherName: user?.motherName || '',
      siblings: user?.siblings || '',
      brotherCount: user?.brotherCount || '',
      sisterCount: user?.sisterCount || '',
      
      country: user?.country || '',
      state: user?.state || '',
      district: user?.district || '',
      city: user?.city || '',
      
      dateOfBirth: user?.dateOfBirth || '',
      timeOfBirth: user?.timeOfBirth || '',
      placeOfBirth: user?.placeOfBirth || '',
      rasi: user?.rasi || '',
      nakshatra: user?.nakshatra || '',
      laknam: user?.laknam || '',
      gothram: user?.gothram || '',
      dhosham: user?.dhosham || '',
      
      preferredRasi: user?.preferredRasi || [],
      preferredNakshatra: user?.preferredNakshatra || [],
      preferredLagnam: user?.preferredLagnam || [],
      preferredDhosham: user?.preferredDhosham || [],
      dhoshamPreference: user?.dhoshamPreference || '',
      horoscopeMatchRequired: user?.horoscopeMatchRequired || '',
      
      prefAgeMin: user?.prefAgeMin || '',
      prefAgeMax: user?.prefAgeMax || '',
      prefHeight: user?.prefHeight || '',
      prefEducation: user?.prefEducation || '',
      prefLocation: user?.prefLocation || '',
      prefReligion: user?.prefReligion || '',
    },
    mode: 'onBlur'
  });

  // ✅ Use watch with specific field names to avoid triggering re-render for every field
  const watchedFields = watch([
    'fullName', 'age', 'height', 'maritalStatus', 'religion', 'motherTongue',
    'education', 'occupation', 'country', 'state', 'district', 'city', 'prefAgeMin', 'prefAgeMax',
    'rasi', 'dateOfBirth', 'caste',
  ]);

  useEffect(() => {
    const requiredFields = [
      'fullName', 'age', 'height', 'maritalStatus', 'religion', 'motherTongue',
      'education', 'occupation', 'country', 'state', 'district', 'city', 'prefAgeMin', 'prefAgeMax'
    ];
    const religion = watchedFields[4];
    const isHindu = religion && religion.toString().toLowerCase() === 'hindu';
    if (isHindu) {
      requiredFields.push('rasi', 'dateOfBirth');
    }
    let filled = 0;
    const watchedArr = [...watchedFields];
    requiredFields.forEach((field, i) => {
      const val = i < watchedArr.length ? watchedArr[i] : null;
      if (val && val.toString().trim() !== '') filled++;
    });
    if (profilePhotoPreview) filled++;
    const totalRequired = requiredFields.length + 1;
    setProgress(Math.round((filled / totalRequired) * 100));
  }, [watchedFields, profilePhotoPreview]);

  // Per-section completion, derived from the same watched fields above
  const isFilled = (i) => !!(watchedFields[i] && watchedFields[i].toString().trim() !== '');
  const religion = watchedFields[4];
  const isHindu = religion && religion.toString().toLowerCase() === 'hindu';
  const completion = {
    personal: isFilled(0) && isFilled(1) && isFilled(2) && isFilled(3) && isFilled(4) && isFilled(5),
    education: isFilled(6) && isFilled(7),
    location: isFilled(8) && isFilled(9) && isFilled(10) && isFilled(11),
    astro: isHindu
      ? !!(horoscopeData?.fields?.rasi && horoscopeData?.fields?.nakshatra && horoscopeData?.saved)
      : true,
    preferences: isFilled(12) && isFilled(13),
    photos: !!profilePhotoPreview,
  };

  // Scroll-spy: highlight the active step in the journey stepper as the user scrolls
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-160px 0px -60% 0px', threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const setProfileFile = (file) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert('Photo must be under 5MB.');
      return;
    }
    setProfilePhoto(file);
    setProfilePhotoPreview(URL.createObjectURL(file));
  };

  const handleProfilePhotoChange = (e) => setProfileFile(e.target.files[0]);

  const handleProfileDrop = (e) => {
    e.preventDefault();
    setIsDraggingProfile(false);
    setProfileFile(e.dataTransfer.files[0]);
  };

  const addAdditionalFiles = (fileList) => {
    const room = 5 - additionalPhotos.length;
    if (room <= 0) return;
    const valid = Array.from(fileList).filter((f) => f.size <= MAX_FILE_SIZE).slice(0, room);
    if (valid.length === 0) return;
    setAdditionalPhotos((prev) => [...prev, ...valid]);
    setAdditionalPhotosPreview((prev) => [...prev, ...valid.map((f) => URL.createObjectURL(f))]);
  };

  const handleAdditionalPhotosChange = (e) => addAdditionalFiles(e.target.files);

  const handleAdditionalDrop = (e) => {
    e.preventDefault();
    setIsDraggingAdditional(false);
    addAdditionalFiles(e.dataTransfer.files);
  };

  const removeProfilePhoto = () => {
    setProfilePhoto(null);
    setProfilePhotoPreview('');
  };

  const removeAdditionalPhoto = (index) => {
    setAdditionalPhotos(prev => prev.filter((_, i) => i !== index));
    setAdditionalPhotosPreview(prev => prev.filter((_, i) => i !== index));
  };

  const syncHoroscopeToForm = (fields) => {
    Object.entries(fields).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') setValue(key, val);
    });
  };

  const onSubmit = async (data) => {
    if (!profilePhotoPreview && !profilePhoto) {
      alert('Please upload a profile photo.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Build multipart form data
      const formData = new FormData();

      // Append all text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'preferredRasi' || key === 'preferredNakshatra' || key === 'preferredLagnam' || key === 'preferredDhosham') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });
      formData.append('horoscopeData', JSON.stringify(horoscopeData));
      formData.append('horoscopeAvailable', horoscopeData?.saved ? 'true' : 'false');
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }
      additionalPhotos.forEach((file) => {
        formData.append('additionalPhotos', file);
      });

      const response = await API.post('/profile/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Persist returned profile data in auth store
      updateProfile({ ...response.data.profile, profileCompleted: true });

      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save profile. Please try again.';
      alert(message);
      console.error('Profile creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 relative">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap');
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; }
      `}</style>

      {/* Ambient background glow */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl" />
      </div>

      {/* Sticky Top Bar: Progress, Save & Journey Stepper */}
      <div className="sticky -top-10 z-40 bg-[#0a0a1a]/95 backdrop-blur-xl border-b border-white/10 mx-4 sm:mx-0 sm:px-0 sm:rounded-b-3xl mb-8 sm:mb-10 shadow-lg shadow-black/40">
        <div className="p-4 sm:px-6 sm:pt-4 sm:pb-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white font-medium">Profile Completion</span>
              <span className="text-pink-400 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-pink-600 via-pink-500 to-[#D4AF37] h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-linear-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-semibold py-2.5 px-8 rounded-xl shadow-lg shadow-pink-600/30 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><CheckCircle size={20} /> Save Profile</>
            )}
          </button>
        </div>

        <div className="px-4 sm:px-6 pb-3 border-t border-white/5">
          <JourneyStepper activeSection={activeSection} completion={completion} onNavigate={scrollToSection} />
        </div>
      </div>

      <div className="mb-10 text-center">
        <span className="inline-block text-[11px] uppercase tracking-[0.2em] text-pink-800 font-semibold mb-3">
          Begin Your Journey
        </span>
        <h1 className="font-display text-3xl md:text-5xl font-semibold text-pink-700  mb-3 tracking-tight">
          Create Your Profile
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          Share a few honest details — they're the first step toward finding the right match. Your information stays private and secure.
        </p>
      </div>

      <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
        
        {/* Personal Details */}
        <SectionCard id="personal" title="Personal Details" icon={User} complete={completion.personal}>
          <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField label="Full Name" name="fullName" icon={User} register={register} errors={errors} rules={{ required: 'Required' }} />
            <InputField label="Age" name="age" type="number" icon={Calendar} register={register} errors={errors} rules={{ required: 'Required', min: 18, max: 80 }} />
            <InputField label="Height (e.g. 5'8&quot;)" name="height" icon={Ruler} register={register} errors={errors} rules={{ required: 'Required' }} />
            <InputField label="Weight (kg)" name="weight" type="number" icon={Scale} register={register} errors={errors} />
            <SelectField label="Marital Status" name="maritalStatus" icon={Heart} register={register} errors={errors} options={MARITAL_STATUS_OPTIONS} rules={{ required: 'Required' }} />
            <SelectField label="Mother Tongue" name="motherTongue" icon={Languages} register={register} errors={errors} options={MOTHER_TONGUE_OPTIONS} rules={{ required: 'Required' }} />
            <SelectField label="Religion" name="religion" icon={BookOpen} register={register} errors={errors} options={RELIGION_OPTIONS} rules={{ required: 'Required' }} />
            <SearchableSelect
              label="Caste"
              icon={Users}
              value={watch('caste')}
              onChange={(v) => { setValue('caste', v); setValue('subCaste', ''); }}
              options={CASTE_OPTIONS}
            />
            <DependentSelectField
              label="Sub Caste"
              icon={Users}
              value={watch('subCaste')}
              onChange={(v) => setValue('subCaste', v)}
              options={getSubCastes(watch('caste'))}
              parentValue={watch('caste')}
            />
          </div>
        </SectionCard>

        {/* Education & Career */}
        <SectionCard id="education" title="Education & Career" icon={Briefcase} complete={completion.education}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Highest Qualification" name="education" icon={BookOpen} register={register} errors={errors} rules={{ required: 'Required' }} />
            <InputField label="Occupation" name="occupation" icon={Briefcase} register={register} errors={errors} rules={{ required: 'Required' }} />
            <InputField label="Company Name" name="companyName" icon={Building} register={register} errors={errors} />
            <InputField label="Annual Income (approx)" name="annualIncome" icon={IndianRupee} register={register} errors={errors} />
          </div>
        </SectionCard>

        {/* Family Details */}
        <SectionCard id="family" title="Family Details" icon={Users} optional>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InputField label="Father's Name" name="fatherName" icon={User} register={register} errors={errors} />
            <InputField label="Mother's Name" name="motherName" icon={User} register={register} errors={errors} />
            <NumberInput label="Number of Brothers" name="brotherCount" icon={Users} value={watch('brotherCount')} onChange={(v) => { setValue('brotherCount', v); }} />
            <NumberInput label="Number of Sisters" name="sisterCount" icon={Users} value={watch('sisterCount')} onChange={(v) => { setValue('sisterCount', v); }} />
          </div>
          {(Number(watch('brotherCount')) > 0 || Number(watch('sisterCount')) > 0) && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              <SiblingFields count={Number(watch('brotherCount'))} prefix="Brother" register={register} errors={errors} />
              <SiblingFields count={Number(watch('sisterCount'))} prefix="Sister" register={register} errors={errors} />
            </div>
          )}
        </SectionCard>

        {/* Location Details */}
        <SectionCard id="location" title="Location Details" icon={MapPin} complete={completion.location}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SearchableSelect
              label="Country"
              icon={Globe}
              value={watch('country')}
              onChange={(v) => { setValue('country', v); setValue('state', ''); setValue('district', ''); setValue('city', ''); }}
              options={COUNTRY_OPTIONS}
              error={errors.country?.message}
            />
            <DependentSelectField
              label="State"
              icon={MapPin}
              value={watch('state')}
              onChange={(v) => { setValue('state', v); setValue('district', ''); setValue('city', ''); }}
              options={getStates(watch('country'))}
              parentValue={watch('country')}
              error={errors.state?.message}
            />
            <DependentSelectField
              label="District"
              icon={MapPin}
              value={watch('district')}
              onChange={(v) => { setValue('district', v); setValue('city', ''); }}
              options={getDistricts(watch('country'), watch('state'))}
              parentValue={watch('state')}
              error={errors.district?.message}
            />
            <DependentSelectField
              label="City"
              icon={MapPin}
              value={watch('city')}
              onChange={(v) => setValue('city', v)}
              options={getCities(watch('country'), watch('state'), watch('district'))}
              parentValue={watch('district')}
              error={errors.city?.message}
            />
          </div>
        </SectionCard>

        {/* Traditional South Indian Horoscope */}
        {(watchedFields[4] && watchedFields[4].toString().toLowerCase() === 'hindu') ? (
          <SectionCard id="astro" title="Traditional Horoscope" icon={Star} complete={completion.astro}>
            <HoroscopeModule
              value={horoscopeData}
              onChange={setHoroscopeData}
              onSyncFormFields={syncHoroscopeToForm}
              onNextStep={() => scrollToSection('preferences')}
              gothramOptions={GOTHRAM_OPTIONS}
            />
          </SectionCard>
        ) : (
          <SectionCard id="astro" title="Astro Details" icon={Star} optional>
            <p className="text-gray-500 text-sm text-center py-4">
              Astro details are available for Hindu profiles. Update your religion to Hindu to add horoscope information.
            </p>
          </SectionCard>
        )}

        {/* Partner Preferences */}
        <SectionCard id="preferences" title="Partner Preferences" icon={Heart} complete={completion.preferences}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                <InputField label="Min Age" name="prefAgeMin" type="number" icon={Calendar} register={register} errors={errors} rules={{ required: 'Required' }} />
              </div>
              <div className="w-1/2">
                <InputField label="Max Age" name="prefAgeMax" type="number" icon={Calendar} register={register} errors={errors} rules={{ required: 'Required' }} />
              </div>
            </div>
            <InputField label="Preferred Height" name="prefHeight" icon={Ruler} register={register} errors={errors} />
            <SelectField label="Preferred Religion" name="prefReligion" icon={BookOpen} register={register} errors={errors} options={RELIGION_OPTIONS} />
            <InputField label="Preferred Education" name="prefEducation" icon={BookOpen} register={register} errors={errors} />
            <InputField label="Preferred Location" name="prefLocation" icon={MapPin} register={register} errors={errors} />
          </div>

          {/* Partner Astro Preferences */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h4 className="text-sm font-semibold text-pink-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Star size={16} /> Partner Astro Preferences
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MultiSelectChips
                label="Preferred Rasi"
                icon={Star}
                value={watch('preferredRasi') || []}
                onChange={(v) => { setValue('preferredRasi', v); setValue('preferredNakshatra', []); setValue('preferredLagnam', []); }}
                options={RASI_OPTIONS}
                placeholder="Select Rasi(s)"
              />
              <MultiSelectChips
                label="Preferred Nakshatra"
                icon={Star}
                value={watch('preferredNakshatra') || []}
                onChange={(v) => { setValue('preferredNakshatra', v); setValue('preferredLagnam', []); }}
                options={getFilteredNakshatras(watch('preferredRasi'))}
                placeholder="Filtered by selected Rasi(s)"
              />
              <MultiSelectChips
                label="Preferred Lagnam"
                icon={Star}
                value={watch('preferredLagnam') || []}
                onChange={(v) => setValue('preferredLagnam', v)}
                options={getFilteredLagnams(watch('preferredNakshatra'))}
                placeholder="Filtered by selected Nakshatra(s)"
              />
              <MultiSelectChips
                label="Preferred Dosham"
                icon={Star}
                value={watch('preferredDhosham') || []}
                onChange={(v) => setValue('preferredDhosham', v)}
                options={DHOSHAM_OPTIONS}
                placeholder="Select Dosham(s)"
              />
              <div>
                <label className="block text-sm font-medium text-black mb-2">Horoscope Match Required</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="true" {...register('horoscopeMatchRequired')} className="text-pink-600 focus:ring-pink-500" />
                    <span className="text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="false" {...register('horoscopeMatchRequired')} className="text-pink-600 focus:ring-pink-500" />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Photo Upload Section */}
        <SectionCard id="photos" title="Profile Photos" icon={ImageIcon} complete={completion.photos}>
          <div className="space-y-8">
            
            {/* Profile Photo - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-3">
                Profile Photo <span className="text-pink-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingProfile(true); }}
                  onDragLeave={() => setIsDraggingProfile(false)}
                  onDrop={handleProfileDrop}

                  className={`relative w-40 h-40 rounded-2xl overflow-hidden bg-white/5 border-2 border-dashed flex items-center justify-center group transition-all duration-200 ${
                    isDraggingProfile ? 'border-pink-500 bg-pink-500/10 scale-[1.02]' : 'border-gray-600 hover:border-pink-500'
                  }`}
                >
                  {profilePhotoPreview ? (
                    <>
                      <img src={profilePhotoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity px-2 text-center">
                          Tap ✕ to replace
                        </span>
                      </div>
                      <button 
                        type="button" 
                        onClick={removeProfilePhoto}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-pink-600 transition-colors z-10"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <User size={40} className="mx-auto text-gray-500 mb-2 group-hover:text-pink-400 transition-colors" />
                      <span className="text-xs text-gray-400">Drop or tap to upload</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfilePhotoChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    disabled={!!profilePhotoPreview}
                  />
                </div>
                <div className="text-sm  max-w-sm">
                  <p className="mb-2 text-gray-800 font-medium">Why is a profile photo important?</p>

                  <ul className="list-disc list-inside space-y-1 text-gray-600 text-xs">
                    <li>Profiles with photos get 10x more responses.</li>
                    <li>Must be a clear front-facing photo.</li>
                    <li>Max file size 5MB. Formats: JPG, PNG.</li>
                  </ul>
                </div>
              </div>
            </div>


            {/* Additional Photos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-200">
                  Additional Photos (Optional)
                </label>
                <span className="text-xs text-gray-500">{additionalPhotosPreview.length}/5 added</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                
                <AnimatePresence>
                  {additionalPhotosPreview.map((preview, index) => (
                    <motion.div 
                      key={preview}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10"
                    >
                      <img src={preview} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeAdditionalPhoto(index)}
                        className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-pink-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {additionalPhotosPreview.length < 5 && (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingAdditional(true); }}
                    onDragLeave={() => setIsDraggingAdditional(false)}
                    onDrop={handleAdditionalDrop}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 border-dashed flex items-center justify-center group transition-all duration-200 ${
                      isDraggingAdditional ? 'border-pink-500 bg-pink-500/10 scale-[1.02]' : 'border-gray-600 bg-white/5 hover:border-pink-500'
                    }`}
                  >
                    <div className="text-center">
                      <UploadCloud size={28} className="mx-auto text-gray-500 mb-2 group-hover:text-pink-400 transition-colors" />
                      <span className="text-xs text-gray-400">Add More</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleAdditionalPhotosChange} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </SectionCard>

      </form>
    </div>
  );
};

export default CreateProfile;