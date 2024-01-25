"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ReactStars from "react-stars";
import Image from "next/image";

interface User {
  id: number;
  name: string;
}

interface Comment {
  id: number;
  content: string;
  user: User;
  created_at: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  comments: Comment[];
  rate: number;
  created_at: string;
  updated_at: string;
  rating: number;
}

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
  <div className="bg-gray-100 rounded-md p-4 mb-4">
    <div className="flex items-center mb-2">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-8 h-8 rounded-full"
          src="https://via.placeholder.com/40"
          alt={comment.user.name}
        />
      </div>
      <div>
        <p className="font-semibold">{comment.user.name}</p>
        <p className="text-xs text-gray-500">{comment.created_at}</p>
      </div>
    </div>
    <div className="pl-12">
      <p className="text-gray-700">{comment.content}</p>
    </div>
  </div>
);

const ProductDetails = () => {
  const params = useParams();
  const product_id = params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [showAllComments, setShowAllComments] = useState<boolean>(false);
  const token = "2|Krr2meJWbTKIR4iCWTX3JysazBcUY4AoCJOHdH9J";
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await fetch(
          `https://event-reg.app/flutter_test/api/products/${product_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProduct(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (product_id) {
      fetchProductById();
    }
  }, [product_id]);

  const toggleShowComments = () => {
    setShowAllComments(!showAllComments);
  };
  const handleCommentSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const userToken = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://event-reg.app/flutter_test/api/comment",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product_id, content }),
        }
      );

      if (response.ok) {
        console.log("Comment posted successfully");
        setContent("");
      } else {
        console.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center">
      {product ? (
        <div className="max-w-xl rounded overflow-hidden shadow-lg">
          <Image className="w-full" src={product.image} alt={product.title} width={500} height={400} priority/>
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{product.title}</div>
            <p className="text-gray-700 text-base">{product.description}</p>
          </div>
          <div className="px-6 font-bold text-xl mb-2">
          <ReactStars
          count={5}
          size={24}
          color2={"#ffd700"}
          value={product.rate}
          edit={false}
        />
          </div>
          <div className="px-6 font-bold text-xl mb-2 mt-6 flex flex-col gap-2">
            <textarea
              name=""
              id=""
              value={content}
              className="resize-none text-sm text-gray-700 focus:outline-none rounded-md border w-full border-[#5D5C68] border-solid placeholder:text-sm p-2"
              onChange={(e) => setContent(e.target.value)}
              placeholder="write your comment..."
            />
            <button
              type="submit"
              className="flex self-end text-gray-800 rounded-md px-2 py-1 text-sm bg-[#dbdcdd]"
              onClick={handleCommentSubmit}
            >
              post
            </button>
          </div>
          <div className="px-6 pt-4">
            <h2 className="font-semibold text-lg mb-2">Comments</h2>
            {showAllComments
              ? product.comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))
              : product.comments
                  .slice(0, 3)
                  .map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
            <div className="flex justify-center mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={toggleShowComments}
              >
                {showAllComments ? "Show Less" : "Show More"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProductDetails;
