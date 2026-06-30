import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className="flex flex-col items-center justify-center py-16 px-4 text-center"
  >
    <div className="w-20 h-20 rounded-2xl bg-pink-100 flex items-center justify-center mb-5">
      <Icon size={36} className="text-pink-500" />
    </div>
    {title && (
      <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{title}</h3>
    )}
    {description && (
      <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-6">{description}</p>
    )}
    {action && (
      <button
        onClick={action.onClick}
        className="btn-primary text-sm"
      >
        {action.label}
      </button>
    )}
  </motion.div>
);

export default EmptyState;
