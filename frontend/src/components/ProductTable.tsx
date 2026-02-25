import { useState } from 'react';
import { Pencil, Trash2, Star, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ProductFormDialog from './ProductFormDialog';
import DeleteProductDialog from './DeleteProductDialog';
import type { Product } from '../types';

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-rose-dark/50" />
        </div>
        <p className="font-serif text-xl text-foreground/60 mb-2">No products yet</p>
        <p className="font-sans text-sm text-foreground/40">
          Click "Add Product" above to add your first product.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-blush-deep/20 overflow-hidden bg-white/60 shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-blush/40 hover:bg-blush/40 border-blush-deep/20">
              <TableHead className="font-sans font-semibold text-rose-dark text-xs uppercase tracking-wider">
                Product
              </TableHead>
              <TableHead className="font-sans font-semibold text-rose-dark text-xs uppercase tracking-wider">
                Category
              </TableHead>
              <TableHead className="font-sans font-semibold text-rose-dark text-xs uppercase tracking-wider text-right">
                Price
              </TableHead>
              <TableHead className="font-sans font-semibold text-rose-dark text-xs uppercase tracking-wider text-right">
                Stock
              </TableHead>
              <TableHead className="font-sans font-semibold text-rose-dark text-xs uppercase tracking-wider text-center">
                Featured
              </TableHead>
              <TableHead className="font-sans font-semibold text-rose-dark text-xs uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id.toString()}
                className="border-blush-deep/10 hover:bg-blush/10 transition-colors"
              >
                {/* Product Name + Image */}
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-blush flex-shrink-0 border border-blush-deep/20">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/generated/product-placeholder.dim_600x600.png';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-rose-dark/30" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-sans font-medium text-foreground text-sm leading-tight">
                        {product.name}
                      </p>
                      <p className="font-sans text-xs text-foreground/50 mt-0.5 line-clamp-1 max-w-[180px]">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-blush text-rose-dark border-0 font-sans text-xs font-medium"
                  >
                    {product.category}
                  </Badge>
                </TableCell>

                {/* Price */}
                <TableCell className="text-right font-sans font-semibold text-foreground text-sm">
                  ${(Number(product.price) / 100).toFixed(2)}
                </TableCell>

                {/* Stock */}
                <TableCell className="text-right">
                  <span
                    className={`font-sans text-sm font-medium ${
                      Number(product.stock) === 0
                        ? 'text-destructive'
                        : Number(product.stock) < 10
                          ? 'text-amber-600'
                          : 'text-foreground'
                    }`}
                  >
                    {Number(product.stock)}
                  </span>
                </TableCell>

                {/* Featured */}
                <TableCell className="text-center">
                  {product.featured ? (
                    <Star className="w-4 h-4 text-gold fill-gold mx-auto" />
                  ) : (
                    <span className="text-foreground/20 text-lg leading-none mx-auto block text-center">—</span>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(product)}
                      className="w-8 h-8 hover:bg-blush hover:text-rose-dark text-foreground/60"
                      title="Edit product"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product)}
                      className="w-8 h-8 hover:bg-destructive/10 hover:text-destructive text-foreground/60"
                      title="Delete product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        mode="edit"
        product={selectedProduct}
      />

      <DeleteProductDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        product={selectedProduct}
      />
    </>
  );
}
