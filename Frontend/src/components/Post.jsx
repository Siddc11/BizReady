import React, { useEffect, useState } from "react";
import { Card, CardBody, Badge } from "reactstrap";
import { FaHeart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { getPost, likePost, commentPost } from "../../controllers/PostController";
import { formatDateTime } from "../utils/dateConversion.js";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { FaShare  } from "react-icons/fa6";
import { FaCommentAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useParams } from 'react-router-dom';
import { RWebShare } from "react-web-share";

import {
  Divider, Button, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  Input,
  FormLabel
} from '@chakra-ui/react'
const Post = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { postID } = useParams();
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  const [isLiked, setIsLiked] = useState(null);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const likeHandler = async () => {
    const tempLiked = !isLiked;
    setIsLiked(tempLiked);
    const token = sessionStorage.getItem("token");
    try {
      const response = await likePost(postID, tempLiked, token);
    } catch (error) {
      alert(error.message);
    } finally {

    }
  }

  const addComment = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await commentPost(postID, comment, token);
      console.log(response.message)
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {

    }
  }


  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      setLoading(true); // Set loading to true before making the API call

      try {
        const response = await getPost(postID, token);
        setPost([response.data]);

        const likedBy = response.data.likedBy
        console.log(response.data)
        setIsLiked(likedBy.includes(jwtDecode(token).id));
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false); // Set loading back to false after the API call completes
      }
    };
    fetchData();
  }, [isLiked, comment]);

  return (
    <div style={styles.wrapper}>
      {post == null && "Loading"}
      {post &&
        post?.map((p) => (
          <div key={p._id} style={styles.postContainer}>
            <UserPost post={p} isLiked={isLiked} likeHandler={likeHandler} />
            <Comments comments={p.comments} />
            <Button onClick={onOpen} leftIcon={<FaCommentAlt />} colorScheme='teal' variant='outline'>
              Comment
            </Button>

            <RWebShare
              data={{
                text: `See this post on BizReady`,
                url: `http://localhost:5173/post/${postID}`,
                title: `${p.title}`,
              }}
            >
              <Button colorScheme='green' leftIcon={<FaShare />} className="ms-3">
              Share
            </Button>
            </RWebShare>

            <Modal
              initialFocusRef={initialRef}
              finalFocusRef={finalRef}
              isOpen={isOpen}
              onClose={onClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Add your comment</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl>
                    <FormLabel>Comment</FormLabel>
                    <Input ref={initialRef} value={comment} onChange={e => setComment(e.target.value)} placeholder='Drop a comment here...' />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme='teal' mr={3} onClick={addComment}>
                    Add Comment
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        ))}
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    backgroundColor: "#f9f9f9",
    minHeight: "calc(100vh - 56px)",
  },
  postContainer: {
    maxWidth: "800px",
    width: "100%",
    marginBottom: "2rem",
  },
  card: {
    maxWidth: "800px",
    margin: "0 auto",
    marginBottom: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease-in-out",
    animation: "fadeInUp 0.5s ease",
  },
  cardHover: {
    transform: "scale(1.05)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
  createdAt: {
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
    fontSize: "0.8rem",
    color: "#777",
  },
};

const UserPost = ({ post, isLiked, likeHandler }) => {
  return (
    <Card style={{ ...styles.card, ...styles.postContainer }}>
      <CardBody>
        <span style={styles.createdAt}>{formatDateTime(post.createdAt)}</span>
        <h2 className="mb-3">{post.title}</h2>
        <div className="mb-3">
          {post.tags.map((tag, index) => (
            <Badge color="success" className="me-2" key={index}>
              {tag}
            </Badge>
          ))}
        </div>
        <p>
          <strong>Category:</strong> {post.category}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="d-flex gap-3 align-items-center" onClick={likeHandler}>

          {isLiked ? <FcLike className="fs-3" /> : <FcLikePlaceholder className="fs-3" />}
          <span>{post.likeCount}{post.likeCount == 1 ? " Like" : " Likes"} </span>
        </div>
      </CardBody>
    </Card>
  );
};

const Comments = ({ comments }) => {
  return (
    <div>
      <Card style={styles.card}>
        <CardBody>
          <h3>Comments</h3>
          <hr />
          {
            comments.length == 0 ?
              <strong>No Comments Yet!</strong> :
              <>
                {comments.map((comment) => (
                  <div key={comment.user._id} className="d-flex flex-column gap-2">
                    <strong>{comment.user.name}</strong>
                    <p className="ms-3 mb-0">{comment.content}</p>
                    <Divider />
                  </div>
                ))}
              </>
          }
        </CardBody>
      </Card>
    </div>
  );
};

export default Post;
