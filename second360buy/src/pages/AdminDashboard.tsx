import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { 
  useGetAdminMe, 
  useAdminLogout, 
  useGetProducts, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct, 
  useToggleProductStatus,
  Product,
  ProductCondition,
  ProductStatus
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, LogOut, Edit, Trash2, Tag, 
  Image as ImageIcon, ToggleLeft, Activity, Box, Search
} from "lucide-react";

// Form schemas
const productSchema = z.object({
  title: z.string().min(3, "Title too short"),
  condition: z.enum(["Like New", "Good", "Used", "Fair"]),
  price: z.coerce.number().min(0, "Price must be positive"),
  images: z.string().min(1, "At least one image URL required").transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  category: z.string().min(2, "Category required"),
  keyFeatures: z.string().optional(),
  status: z.enum(["Available", "Sold"]).default("Available")
});

type ProductFormData = z.input<typeof productSchema>;

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Auth check
  const { data: admin, isLoading: adminLoading, isError: adminError } = useGetAdminMe({
    query: { retry: false }
  });

  if (adminError || (!adminLoading && !admin?.authenticated)) {
    setLocation("/admin/login");
    return null;
  }

  // Data fetching
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { mutateAsync: logout } = useAdminLogout();
  const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const { mutateAsync: toggleStatus } = useToggleProductStatus();

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    setLocation("/");
  };

  const handleCreate = async (values: ProductFormData) => {
    try {
      await createProduct({ data: values });
      toast({ title: "Product created", description: "AI is generating the description." });
      setIsCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    } catch (err) {
      toast({ title: "Error", description: "Failed to create product", variant: "destructive" });
    }
  };

  const handleUpdate = async (values: ProductFormData) => {
    if (!editingProduct) return;
    try {
      await updateProduct({ id: editingProduct.id, data: values });
      toast({ title: "Product updated" });
      setEditingProduct(null);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update product", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct({ id });
        toast({ title: "Product deleted" });
        queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      } catch (err) {
        toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
      }
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleStatus({ id });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Status updated" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const filteredProducts = products?.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (adminLoading) return <div className="p-8 text-center">Loading Admin...</div>;

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Admin Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Box className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-lg">Marketplace Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation("/")} className="text-muted-foreground">
              View Store
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-9 bg-card border-border/60"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-md">
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl font-display">
                  <SparklesIcon className="w-5 h-5 text-primary" /> Create New Listing
                </DialogTitle>
                <p className="text-sm text-muted-foreground">AI will automatically generate a compelling description based on your inputs.</p>
              </DialogHeader>
              <ProductForm onSubmit={handleCreate} isPending={isCreating} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-display">Edit Listing</DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <ProductForm 
                initialData={editingProduct} 
                onSubmit={handleUpdate} 
                isPending={isUpdating} 
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Table */}
        <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border/60">
                <tr>
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {productsLoading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground animate-pulse">Loading inventory...</td></tr>
                ) : filteredProducts?.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No products found. Add your first item!</td></tr>
                ) : (
                  filteredProducts?.map((product) => (
                    <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary border border-border/50 flex-shrink-0">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : <ImageIcon className="w-full h-full p-3 text-muted-foreground/30" />}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground mb-1">{product.title}</div>
                            <div className="text-xs text-muted-foreground">Added {format(new Date(product.createdAt), 'MMM d, yyyy')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="text-xs">{product.category}</Badge>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        ${product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={product.status === 'Available' ? 'default' : 'secondary'} className="gap-1">
                          <Activity className="w-3 h-3" />
                          {product.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-2 text-xs"
                            onClick={() => handleToggle(product.id)}
                            title="Toggle Status"
                          >
                            <ToggleLeft className="w-4 h-4 mr-1" />
                            {product.status === 'Available' ? 'Mark Sold' : 'Mark Avail'}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

// Mini component for form reused in Create/Edit
function ProductForm({ onSubmit, isPending, initialData }: { onSubmit: any, isPending: boolean, initialData?: Product }) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      condition: initialData.condition,
      price: initialData.price,
      images: initialData.images.join(', '), // render back to string for input
      category: initialData.category,
      keyFeatures: initialData.keyFeatures || "",
      status: initialData.status
    } : {
      title: "",
      price: 0,
      images: "",
      category: "",
      keyFeatures: "",
      status: "Available"
    }
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Product Title</Label>
          <Input {...form.register("title")} placeholder="e.g. MacBook Pro M2 Max" />
          {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Category</Label>
          <Input {...form.register("category")} placeholder="e.g. Laptops" />
          {form.formState.errors.category && <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Price ($)</Label>
          <Input type="number" step="0.01" {...form.register("price")} />
          {form.formState.errors.price && <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Condition</Label>
          <Select 
            onValueChange={(v) => form.setValue("condition", v as any)} 
            defaultValue={form.watch("condition")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Like New">Like New</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Used">Used</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.condition && <p className="text-xs text-destructive">{form.formState.errors.condition.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Images (Comma separated URLs)</Label>
        <Textarea 
          {...form.register("images")} 
          placeholder="https://image1.jpg, https://image2.jpg"
          className="h-20"
        />
        {form.formState.errors.images && <p className="text-xs text-destructive">{form.formState.errors.images.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Key Features / Highlights (Optional)</Label>
        <Textarea 
          {...form.register("keyFeatures")} 
          placeholder="16GB RAM, 1TB SSD, Battery 100%"
          className="h-20"
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full h-12 text-lg">
        {isPending ? "Saving..." : initialData ? "Update Listing" : "Create & Generate AI Description"}
      </Button>
    </form>
  );
}

// Icon helper
function SparklesIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
