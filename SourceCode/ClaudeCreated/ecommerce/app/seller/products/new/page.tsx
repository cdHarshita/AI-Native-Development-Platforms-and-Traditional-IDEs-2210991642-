import ProductForm from "@/components/seller/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Add New Product</h1>
      <ProductForm />
    </div>
  );
}
