import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ConfirmSignOutModal = ({
  isOpen,
  onClose,
  onSignOut,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="rounded-none border-0 bg-floor p-8 text-ink shadow-none sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-normal tracking-tight text-ink">
            ¿Cerrar sesión?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-3 sm:justify-start">
          <button
            type="button"
            onClick={onClose}
            className="px-1 font-display text-sm text-ink/60 hover:text-ink"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="bg-tape px-4 py-2 font-display text-sm text-on-tape"
          >
            Cerrar sesión
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
