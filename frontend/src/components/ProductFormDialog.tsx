import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAddProduct, useUpdateProduct, type ProductFormData } from '../hooks/useQueries';
import type { Product } from '../types';

const CATEGORIES = [
  'Skincare',
  'Makeup',
  'Fragrance',
  'Hair Care',
  'Body Care',
  'Nail Care',
  'Tools & Accessories',
  'Sets & Kits',
];

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  product?: Product | null;
}

const emptyForm: ProductFormData = {
  name: '',
  category: '',
  description: '',
  price: 0,
  imageUrl: '',
  stock: 0,
  featured: false,
};

export default function ProductFormDialog({
  open,
  onOpenChange,
  mode,
  product,
}: ProductFormDialogProps) {
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

  const isPending = addProduct.isPending || updateProduct.isPending;

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && product) {
      setForm({
        name: product.name,
        category: product.category,
        description: product.description,
        price: Number(product.price) / 100,
        imageUrl: product.imageUrl,
        stock: Number(product.stock),
        featured: product.featured,
      });
    } else if (mode === 'add') {
      setForm(emptyForm);
    }
    setErrors({});
  }, [mode, product, open]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (form.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!form.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';
    if (form.stock < 0) newErrors.stock = 'Stock cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === 'add') {
      addProduct.mutate(form, {
        onSuccess: () => {
          toast.success('Product added successfully!');
          onOpenChange(false);
        },
        onError: (err) => {
          toast.error(`Failed to add product: ${err.message}`);
        },
      });
    } else if (mode === 'edit' && product) {
      updateProduct.mutate(
        { id: product.id, data: form },
        {
          onSuccess: () => {
            toast.success('Product updated successfully!');
            onOpenChange(false);
          },
          onError: (err) => {
            toast.error(`Failed to update product: ${err.message}`);
          },
        },
      );
    }
  };

  const setField = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-ivory border-blush-deep/30">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-rose-dark">
            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
          </DialogTitle>
          <DialogDescription className="text-foreground/60 font-sans text-sm">
            {mode === 'add'
              ? 'Fill in the details below to add a new product to your store.'
              : 'Update the product details below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="font-sans text-sm font-medium text-foreground/80">
              Product Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="e.g. Rose Glow Serum"
              className="border-blush-deep/40 focus:border-gold bg-white/60"
            />
            {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="font-sans text-sm font-medium text-foreground/80">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={form.category} onValueChange={(val) => setField('category', val)}>
              <SelectTrigger className="border-blush-deep/40 focus:border-gold bg-white/60">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-destructive text-xs">{errors.category}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="font-sans text-sm font-medium text-foreground/80">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Describe the product..."
              rows={3}
              className="border-blush-deep/40 focus:border-gold bg-white/60 resize-none"
            />
            {errors.description && <p className="text-destructive text-xs">{errors.description}</p>}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price" className="font-sans text-sm font-medium text-foreground/80">
                Price ($) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                min="0.01"
                step="0.01"
                value={form.price || ''}
                onChange={(e) => setField('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="border-blush-deep/40 focus:border-gold bg-white/60"
              />
              {errors.price && <p className="text-destructive text-xs">{errors.price}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="stock" className="font-sans text-sm font-medium text-foreground/80">
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock || ''}
                onChange={(e) => setField('stock', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="border-blush-deep/40 focus:border-gold bg-white/60"
              />
              {errors.stock && <p className="text-destructive text-xs">{errors.stock}</p>}
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <Label htmlFor="imageUrl" className="font-sans text-sm font-medium text-foreground/80">
              Image URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="imageUrl"
              value={form.imageUrl}
              onChange={(e) => setField('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="border-blush-deep/40 focus:border-gold bg-white/60"
            />
            {errors.imageUrl && <p className="text-destructive text-xs">{errors.imageUrl}</p>}
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3 py-1">
            <Checkbox
              id="featured"
              checked={form.featured}
              onCheckedChange={(checked) => setField('featured', !!checked)}
              className="border-blush-deep/60 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
            />
            <Label htmlFor="featured" className="font-sans text-sm font-medium text-foreground/80 cursor-pointer">
              Feature this product on the homepage
            </Label>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="border-blush-deep/40 text-foreground/70 hover:bg-blush/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-rose-dark hover:bg-rose-dark/90 text-ivory font-sans"
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === 'add' ? 'Add Product' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
