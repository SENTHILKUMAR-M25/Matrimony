import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, X } from 'lucide-react';

const variantStyles = {
  danger: {
    button: 'bg-red-600 hover:bg-red-700 focus:ring-red-300',
    icon: 'text-red-600 bg-red-100',
    border: 'border-red-200',
  },
  warning: {
    button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-300',
    icon: 'text-amber-600 bg-amber-100',
    border: 'border-amber-200',
  },
  info: {
    button: 'bg-gradient-to-r from-pink-500 to-pink-600 hover:shadow-lg hover:shadow-pink-300/50 focus:ring-pink-300',
    icon: 'text-pink-600 bg-pink-100',
    border: 'border-pink-200',
  },
};

const ConfirmDialog = ({
  open,
  onOpenChange,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  onConfirm,
  confirmText = 'Confirm',
  variant = 'danger',
}) => {
  const styles = variantStyles[variant] || variantStyles.danger;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] sm:max-w-md"
              >
                <div className={`bg-white rounded-2xl shadow-2xl border ${styles.border} p-6`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
                      {variant === 'info' ? <Info size={20} /> : <AlertTriangle size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        {title}
                      </Dialog.Title>
                      <Dialog.Description className="mt-1.5 text-sm text-gray-600 leading-relaxed">
                        {message}
                      </Dialog.Description>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        aria-label="Close"
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-6">
                    <Dialog.Close asChild>
                      <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 active:scale-[0.98]">
                        Cancel
                      </button>
                    </Dialog.Close>
                    <button
                      onClick={() => {
                        onConfirm();
                        onOpenChange(false);
                      }}
                      className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] ${styles.button}`}
                    >
                      {confirmText}
                    </button>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default ConfirmDialog;
