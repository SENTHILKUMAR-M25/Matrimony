import { motion } from 'framer-motion';

const Messages = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">Messages</h1>
      <p className="text-gray-400">Chat with your accepted matches.</p>
    </motion.div>
  );
};

export default Messages;
