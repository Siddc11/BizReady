import { React, useState, useEffect } from "react";
import { Card, CardBody, Badge } from "reactstrap";
import { FaUserCircle } from "react-icons/fa";
import { getFeeds } from '../../controllers/PostController.js'
import Spinner from "./Spinner";
import { formatDateTime } from '../utils/dateConversion.js'
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const [feeds, setFeeds] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      setLoading(true); // Set loading to true before making the API call

      try {
        const response = await getFeeds(token);
        setFeeds(response.data)
        console.log(response.data)
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
      {feeds?.map((feed, index) => {
        return (
          <div key={index} style={styles.feedContainer} onClick={() => {
            navigate(`/post/${feed._id}`);
          }}>
            <UserFeed feed={feed} />
          </div>
        )
      }
      )}
    </div>
  );
};


export default Feed;

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    backgroundColor: "#f9f9f9",
    minHeight: "calc(100vh - 56px)",
  },
  feedContainer: {
    maxWidth: "800px",
    width: "100%",
    marginBottom: "0.5rem",
    cursor:"pointer"
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
  username: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  userProfileIcon: {
    marginRight: "0.5rem",
    fontSize: "1.5rem",
    color: "#777",
  },
};

const UserFeed = ({ feed }) => {
  return (
    <Card style={styles.card}>
      <CardBody>
        <div style={styles.username}>
          <FaUserCircle style={styles.userProfileIcon} />
          <span>{feed?.author?.name}</span>
        </div>
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}><strong>{feed.title}</strong></div>
        <hr></hr>
        <div><strong>Category:</strong> {feed.category}</div>
        <div>
          <div dangerouslySetInnerHTML={{ __html: feed.content }} />
          <div>
          </div>
          {feed.tags.map((tag, index) => {
            return (
              <Badge color="success" className="me-2" key={index}>
                {tag}
              </Badge>
            )
          }
          )}
        </div>
      </CardBody>
    </Card>
  );
};