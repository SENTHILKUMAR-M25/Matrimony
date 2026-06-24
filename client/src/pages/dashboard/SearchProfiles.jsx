import { motion } from 'framer-motion';

const SearchProfiles = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">Search Profiles</h1>
      <p className="text-gray-400">Use advanced filters to find your perfect match.</p>
    </motion.div>
  );
};

export default SearchProfiles;
