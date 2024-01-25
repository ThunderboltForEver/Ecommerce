"use client";
import { useState } from "react";

const CommentComponent: React.FC = () => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (token) {
      try {
        const response = await fetch(
          "https://event-reg.app/flutter_test/api/comment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
          }
        );

        if (response.ok) {
          setContent("");
        } else {
          console.error("Failed to post comment");
        }
      } catch (error) {
        console.error("Error posting comment:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        rows={4}
        cols={40}
        disabled={isSubmitting}
      />
      <button onClick={handleSubmit} disabled={!content || isSubmitting}>
        {isSubmitting ? "Posting..." : "Post Comment"}
      </button>
    </div>
  );
};

export default CommentComponent;
