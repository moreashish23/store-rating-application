import { Fragment } from "react";
import type{ ReactNode } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { MdClose } from "react-icons/md";

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

const AppModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: AppModalProps) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={onClose}>
      <TransitionChild
        as={Fragment}
        enter="ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      </TransitionChild>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel
              className={`w-full ${sizeMap[size]} bg-white rounded-2xl shadow-2xl ring-1 ring-slate-100`}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <DialogTitle className="text-base font-bold text-slate-800">
                  {title}
                </DialogTitle>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                  aria-label="Close modal"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-5">{children}</div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </Transition>
);

export default AppModal;