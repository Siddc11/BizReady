import React, { useState, useRef } from "react";
import {
  Card,
  CardBody,
  Form,
  Input,
  Label,
  Button,
  Container,
} from "reactstrap";
import JoditEditor from "jodit-react";
import { toast } from "react-toastify";
import { createBlogPost } from "../../controllers/CreateBlogController.js";
import Spinner from "../components/Spinner.jsx";

const AddMentorships = () => {
  const editor = useRef(null);
  const [post, setPost] = useState({
    title: "",
    content: "",
    category: "", // Changed to a single category field
    tags: "",
    isMentor: true,
  });
  const [loading, setLoading] = useState(false);
  const fieldChanged = (event) => {
    const { name, value } = event.target;
    setPost({ ...post, [name]: value });
  };

  const contentFieldChanged = (data) => {
    setPost({ ...post, content: data });
  };

  const createPost = async (event) => {
    event.preventDefault();
    if (post.title.trim() === "") {
      toast.error("Post title is required!!");
      return;
    }
    if (post.content.trim() === "") {
      toast.error("Post content is required!!");
      return;
    }
    if (post.category === "") {
      toast.error("Select a category!!");
      return;
    }

    // Prepare the data to be sent to the backend
    const postData = {
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags.split(","),
    };

    try {
      setLoading(true);
      // Call the createBlogPost controller to send the data to the backend
      const response = await createBlogPost(
        postData,
        sessionStorage.getItem("token")
      );

      // Handle success
      alert(response.message);
      console.log("Blog post created successfully:", response);
      toast.success("Post Created!!");

      // Reset form fields
      setPost({
        title: "",
        content: "",
        category: "",
        tags: "",
      });
    } catch (error) {
      // Handle error
      alert(error.message);
      console.error("Error creating blog post:", error.message);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    wrapper: {
      padding: "2rem",
      backgroundColor: "#f9f9f9",
      minHeight: "calc(100vh - 56px)",
    },
    card: {
      maxWidth: "800px",
      margin: "0 auto",
    },
  };

  return (
    <div style={styles.wrapper}>
      <Card style={styles.card}>
        <CardBody>
          <h3>Mentorship Program</h3>
          <Form onSubmit={createPost}>
            <div className="my-3">
              <Label for="title">Program Title</Label>
              <Input
                type="text"
                id="title"
                placeholder="Enter here"
                className="rounded-0"
                name="title"
                value={post.title}
                onChange={fieldChanged}
              />
            </div>
            <div className="my-3">
              <Label for="category">Program Category</Label>
              <Input
                type="text"
                id="category"
                placeholder="Enter category"
                className="rounded-0"
                name="category"
                value={post.category}
                onChange={fieldChanged}
              />
            </div>
            <div className="my-3">
              <Label for="content">Program Content</Label>
              <JoditEditor
                ref={editor}
                value={post.content}
                onChange={(newContent) => contentFieldChanged(newContent)}
              />
            </div>
            <div className="my-3">
              <Label for="tags">Tags (comma-separated)</Label>
              <Input
                type="text"
                id="tags"
                placeholder="Enter tags"
                className="rounded-0"
                name="tags"
                value={post.tags}
                onChange={fieldChanged}
              />
            </div>

            <Container className="text-center">
              <Button
                type="submit"
                disabled={loading ? true : false}
                className="btn"
                color="primary"
              >
                Create Program
              </Button>

              <Button className="ms-2" color="danger">
                Reset Program
              </Button>

              <div
                className="spinner my-3"
                style={{
                  justifyContent: "center",
                  width: "100%",
                  display: loading ? "flex" : "none",
                }}
              >
                <Spinner />
              </div>
            </Container>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddMentorships;
