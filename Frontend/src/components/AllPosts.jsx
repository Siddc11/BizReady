import { React, useState, useEffect } from "react";
import { Card, CardBody } from "reactstrap";
import { getAllPosts } from '../../controllers/PostController.js'
import Spinner from "./Spinner";
import { formatDateTime } from '../utils/dateConversion.js'
import { Link, useNavigate } from 'react-router-dom';

const styles = {
  wrapper: {
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

  },
  card: {
    width: "200px",
    minHeight: "100%",
    cursor: "pointer",
    transition: "transform 0.3s ease-in-out",
    animation: "fadeInUp 0.5s ease",
  },
  title: {
    fontSize: "0.5rem",
    fontWeight: "bold",
  },
  tags: {
    fontSize: "1rem",
  },
  postNumber: {
    height: "75%"
  }
};


const AllPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      setLoading(true); // Set loading to true before making the API call

      try {
        const response = await getAllPosts(token);
        setPosts(response.data)
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false); // Set loading back to false after the API call completes
      }
    }
    fetchData()
  }, [])

  return (
    <div style={styles.wrapper}>
      <div
        className="spinner text-center"
        style={{
          margin: "auto",
          justifyContent: "center",
          display: loading ? "block" : "none",
        }}
      >
        <Spinner />
      </div>
      <div className="d-flex flex-wrap gap-3 justify-content-center" >
        {posts?.map((post, index) => {
          return(
            <div 
            onClick={()=>{navigate(`/post/${post._id}`, { state: { postId: post._id } });}}
            >
              <UserPost post={post} index={index} key={post._id}/>
            </div>
          )
        }
        )}
      </div>
    </div>
  );
};



const UserPost = ({ post, index }) => {
  return (

    <Card style={{ ...styles.card, ...styles.cardHover }} >
      <CardBody>
        <div style={styles.postNumber}>
          <h6 style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{post.title}</h6>
        <p style={{ fontSize: ".8rem" }}>{formatDateTime(post.createdAt)}</p>
        <hr style={{ margin: "0.5rem 0" }} />
      </div>

      <div style={styles.counts}>
        <div style={{ margin: "auto", display: "flex", justifyContent: "center" }}>
          <p>❤️ {post.likeCount} likes</p>
        </div>
      </div>

    </CardBody>
    </Card >
  );
};

export default AllPosts;
