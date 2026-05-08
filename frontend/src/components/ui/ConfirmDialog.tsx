import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { MdWarningAmber } from "react-icons/md";
import Button from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmLabel = "Confirm",
  loading = false,
}: ConfirmDialogProps) => (
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
            <DialogPanel className="w-full max-w-sm bg-white rounded-2xl shadow-2xl ring-1 ring-slate-100">
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                  <MdWarningAmber className="w-7 h-7 text-amber-500" />
                </div>
                <DialogTitle className="text-base font-bold text-slate-800 mb-2">
                  {title}
                </DialogTitle>
                <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={onConfirm}
                    loading={loading}
                    className="flex-1"
                  >
                    {confirmLabel}
                  </Button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </Transition>
);

export default ConfirmDialog;