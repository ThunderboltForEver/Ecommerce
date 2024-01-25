interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  comments: number;
  rate: number;
  created_at: string;
  updated_at: string;
  rating: number; 
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <img src={product.image} alt={product.title} className="h-48 w-full object-cover mb-4 rounded-lg" />
      <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-blue-600 font-bold">Comments: {product.comments}</p>
      <p className="text-blue-600 font-bold">Rate: {Math.round(product.rate) }</p>
      
    </div>
  );
};

export default ProductCard;
