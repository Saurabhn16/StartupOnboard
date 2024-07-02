import React, { useState, useEffect } from "react";
import useBlogs from "../../hooks/useBlogs";
import useLike from "../../hooks/useLike";
import useComment from "../../hooks/useComment";
import "daisyui/dist/full.css"; // Import daisyUI styles
import toast from "react-hot-toast";
// import "./userBlogs.css";

const UserBlogs = ({ userId }) => {
  const [inputs, setInputs] = useState({
    title: "",
    content: "",
    author: "",
    imgLink: "", // Add imgLink to the state
  });
  const [blogs, setBlogs] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [viewLikes, setViewLikes] = useState(null);
  const [viewComments, setViewComments] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { blogs: createBlog, loading: createLoading } = useBlogs();
  const { likeBlog, loading: likeLoading } = useLike();
  const { commentBlog, loading: commentLoading } = useComment();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs");
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
      const data = await response.json();

      // Filter blogs based on the logged-in user's ID
      const userBlogs = data.filter((blog) => blog.authorId === userId);
      setBlogs(userBlogs);

    } catch (error) {
      console.error("Error fetching blogs:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    await createBlog(inputs);

    fetchBlogs();
    setIsPreviewOpen(false);
    setIsDialogOpen(false);
  };

  const handleLike = async (blogId) => {
    await likeBlog(blogId);
    fetchBlogs();
  };

  const handleComment = async (blogId) => {
    const commentInput = commentInputs[blogId];
    if (!commentInput) {
      toast.error("Please enter a comment");
      return;
    }

    await commentBlog(blogId, commentInput);
    fetchBlogs();
    setCommentInputs({ ...commentInputs, [blogId]: "" });
  };

  const toggleLikes = (blogId) => {
    if (viewLikes === blogId) {
      setViewLikes(null);
    } else {
      setViewLikes(blogId);
    }
  };

  const toggleComments = (blogId) => {
    if (viewComments === blogId) {
      setViewComments(null);
    } else {
      setViewComments(blogId);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleCommentInputChange = (e, blogId) => {
    const { value } = e.target;
    setCommentInputs({ ...commentInputs, [blogId]: value });
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsPreviewOpen(false);
  };

  const openPreview = () => {
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Startup userBlogs</h1>
      <button className="btn btn-primary mb-6" onClick={openDialog}>
        New Post
      </button>
      <dialog open={isDialogOpen} className="modal">
        <form className="modal-box">
          <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
          <input
            type="text"
            name="title"
            value={inputs.title}
            onChange={handleChange}
            placeholder="Title"
            className="input mb-4 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            name="content"
            value={inputs.content}
            onChange={handleChange}
            placeholder="Content"
            className="textarea mb-4 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          />
          <input
            type="text"
            name="author"
            value={inputs.author}
            onChange={handleChange}
            placeholder="Author"
            className="input mb-4 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="imgLink"
            value={inputs.imgLink}
            onChange={handleChange}
            placeholder="Image Link (Optional)"
            className="input mb-4 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="modal-action flex justify-end">
            <button type="button" className="btn mr-2" onClick={closeDialog}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={openPreview}
            >
              Preview
            </button>
          </div>
        </form>
      </dialog>

      <dialog open={isPreviewOpen} className="modal">
        <div className="modal-box">
          <h2 className="text-2xl font-bold mb-4">Preview Post</h2>
          <h3 className="text-xl font-bold mb-2">{inputs.title}</h3>
          <p className="mb-4">{inputs.content}</p>
          <p className="text-gray-600 mb-4">Author: {inputs.author}</p>
          {inputs.imgLink && (
            <img
              src={inputs.imgLink}
              alt="userBlogs visual"
              className="mb-4 rounded-lg shadow-lg"
            />
          )}
          <div className="modal-action flex justify-end">
            <button type="button" className="btn mr-2" onClick={closePreview}>
              Edit
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={createLoading}
            >
              {createLoading ? "Creating..." : "Post"}
            </button>
          </div>
        </div>
      </dialog>

      {blogs.map((blog) => (
        <div key={blog._id} className="bg-white shadow-md rounded-lg mb-6">
          <div className="p-6">
            <div className="w-full pr-4">
              <h2 className="text-xl font-bold">{blog.title}</h2>
              <p className="text-gray-600">Author: {blog.author}</p>
            </div>
            <div className="">
              <p className="text-gray-600 mb-4">Content: {blog.content}</p>
              {blog.imgLink && (
                <img
                  src={blog.imgLink}
                  alt="userBlogs visual"
                  className="mb-4 rounded-lg shadow-lg"
                />
              )}
            </div>

            <div className="w-1/4 flex flex-col items-center justify-start">
              <button
                onClick={() => handleLike(blog._id)}
                className="btn btn-outline btn-sm btn-primary mb-2 w-full"
                disabled={likeLoading}
              >
                {likeLoading ? "Liking..." : "Like"}
              </button>
              <button
                onClick={() => toggleLikes(blog._id)}
                className="btn btn-outline btn-sm btn-primary mb-2 w-full"
              >
                {viewLikes === blog._id ? "Hide Likes" : "View Likes"}
              </button>
              <button
                onClick={() => toggleComments(blog._id)}
                className="btn btn-outline btn-sm btn-primary mb-2 w-full"
              >
                {viewComments === blog._id ? "Hide Comments" : "View Comments"}
              </button>
              {viewComments === blog._id && (
                <div className="flex flex-col items-center mt-2 w-full">
                  <input
                    type="text"
                    value={commentInputs[blog._id] || ""}
                    onChange={(e) =>
                      setCommentInputs({
                        ...commentInputs,
                        [blog._id]: e.target.value,
                      })
                    }
                    placeholder="Enter your comment"
                    className="input mb-2 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleComment(blog._id)}
                    className="btn btn-outline btn-sm btn-primary w-full"
                    disabled={commentLoading}
                  >
                    {commentLoading ? "Commenting..." : "Comment"}
                  </button>
                </div>
              )}
            </div>

            {viewLikes === blog._id && (
              <div className="mt-4">
                <h3 className="font-bold mb-2">Likes:</h3>
                {blog.likes.length > 0 ? (
                  <ul>
                    {blog.likes.map((likeId) => (
                      <li key={likeId}>{likeId}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No likes yet.</p>
                )}
              </div>
            )}

            {viewComments === blog._id && (
              <div className="mt-4">
                <h3 className="font-bold mb-2">Comments:</h3>
                {blog.comments.length > 0 ? (
                  <ul>
                    {blog.comments.map((comment, index) => (
                      <li key={index} className="mb-2">
                        <strong>{comment.author}:</strong> {comment.text}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserBlogs;
