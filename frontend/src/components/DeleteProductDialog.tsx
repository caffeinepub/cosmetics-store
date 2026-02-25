import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { useDeleteProduct } from '../hooks/useQueries';
import type { Product } from '../types';

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export default function DeleteProductDialog({
  open,
  onOpenChange,
  product,
}: DeleteProductDialogProps) {
  const deleteProduct = useDeleteProduct();

  const handleDelete = () => {
    if (!product) return;
    deleteProduct.mutate(product.id, {
      onSuccess: () => {
        toast.success(`"${product.name}" has been deleted.`);
        onOpenChange(false);
      },
      onError: (err) => {
        toast.error(`Failed to delete product: ${err.message}`);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-ivory border-blush-deep/30 max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <AlertDialogTitle className="font-serif text-xl text-rose-dark">
              Delete Product
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="font-sans text-foreground/70 text-sm leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-foreground">"{product?.name}"</span>? This action
            cannot be undone and the product will be permanently removed from your store.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            disabled={deleteProduct.isPending}
            className="border-blush-deep/40 text-foreground/70 hover:bg-blush/50"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteProduct.isPending}
            className="bg-destructive hover:bg-destructive/90 text-white font-sans"
          >
            {deleteProduct.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete Product
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
