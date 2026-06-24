import { motion } from 'framer-motion';

const Subscription = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">Subscription</h1>
      <p className="text-gray-400">Manage your membership plan.</p>
    </motion.div>
  );
};

export default Subscription;
