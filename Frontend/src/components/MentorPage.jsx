import React, { useState, useEffect } from "react";
import { Card, CardBody, Badge } from "reactstrap";
import { FaUserCircle } from "react-icons/fa";
import Spinner from "./Spinner";
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react'
const MentorPage = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSf132pM8H8dnrIwKItLIUpjDG3v1bxcHvhHV45Eu5SOCz3vrg/viewform?usp=sf_link"

  const openGoogleForm = () => {
    window.open(formUrl, "_blank");
  };

  useEffect(() => {
    // Simulated mentor data
    const mentorData = [
      {
        id: 1,
        name: "Vivek Bindra",
        qualification: "MBA in Entrepreneurship",
        program: "Entrepreneurship Mentorship Program",
        insights: "Gain valuable insights and support to kickstart your entrepreneurial journey.",
        description: "Join our mentorship program to receive guidance and support in your entrepreneurial journey.",
        resources: ["Guide to Business Planning", "Financial Management Tips"],
        tags: ["Entrepreneurship", "Business"],
        // Add a photo of the mentor
        photo: "data:image/jpeg;base64,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"
      },

      {
        id: 2,
        name: "Ritesh Agarwal",
        qualification: "PhD in Marketing",
        program: "Marketing Mentorship Program",
        insights: "Get expert advice and strategies to excel in the field of marketing.",
        description: "Join our mentorship program to receive personalized guidance and strategies to boost your marketing career.",
        resources: ["Social Media Marketing Guide", "SEO Techniques"],
        tags: ["Marketing", "Digital Marketing"],
        photo: "https://blog-res.admitkard.com/blog/wp-content/uploads/2023/06/19155129/Slide-2-Photo-from-telegraphindia.png"
      },
      {
        id: 3,
        name: "Kunal Shaha",
        qualification: "MS in Finance",
        program: "Financial Management Mentorship Program",
        insights: "Learn essential financial management skills from industry experts.",
        description: "Join our mentorship program to gain practical knowledge and insights into financial management.",
        resources: ["Budgeting Strategies", "Investment Planning Tips"],
        tags: ["Finance", "Investment"],
        photo: "http://t2.gstatic.com/images?q=tbn:ANd9GcSt76CTqw0RbxNd968KnYTenYhLUTiOKvJMcBjoXIFyJzWES8qC"
      },

      {
        id: 4,
        name: "Vijay Shekhar Sharma ",
        qualification: "Bachelor's in Computer Science",
        program: "Tech Entrepreneurship Mentorship Program",
        insights: "Discover the latest trends and strategies in the tech industry.",
        description: "Join our mentorship program to launch and scale your tech startup with confidence.",
        resources: ["Tech Startup Guide", "Software Development Best Practices"],
        tags: ["Technology", "Entrepreneurship"],
        photo: "https://www.founderjar.com/wp-content/uploads/2022/09/Vijay-Shekhar-Sharma.jpeg"
      }
      // Add more mentor data as needed
    ];

    setLoading(true);
    // Simulating API call delay
    setTimeout(() => {
      setMentors(mentorData);
      setLoading(false);
    }, 1500); // Adjust delay time as needed
  }, []);

  return (
    <div style={styles.wrapper}>
      <h1>Mentorship Programs</h1>
      {loading && <Spinner />}
      {!loading && mentors.map(mentor => (
        <MentorCard key={mentor.id} mentor={mentor} navigate={navigate} />
      ))}
    </div>
  );
};

const MentorCard = ({ mentor }) => {
    const navigate = useNavigate();

    
  const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSf132pM8H8dnrIwKItLIUpjDG3v1bxcHvhHV45Eu5SOCz3vrg/viewform?usp=sf_link"

    const openGoogleForm = () => {
        window.open(formUrl, "_blank");
      };

  return (
    <Card style={styles.card}>
      <CardBody>
        <div style={styles.avatar}>
          <img src={mentor.photo} alt="Mentor Avatar" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
          <span style={styles.title}>{mentor.program}</span>
        </div>
        <div style={styles.header}>
          <FaUserCircle style={styles.userProfileIcon} />
          <div>
            <span>{mentor.name}</span>
            <span style={styles.qualification}>{mentor.qualification}</span>
          </div>
        </div>
        <p>{mentor.insights}</p>
        <p>{mentor.description}</p>
        <div><strong>Resources:</strong></div>
        <ul>
          {mentor.resources.map((resource, index) => (
            <li key={index}>{resource}</li>
          ))}
        </ul>
        <div>
          {mentor.tags.map((tag, index) => (
            <Badge color="success" className="me-2" key={index}>{tag}</Badge>
          ))}
        </div>
        <div style={styles.footer}>
          <small>For basic access, enroll now. For unlimited access and complete resources, buy the premium.</small>
          <div className="mt-3">
            <Button colorScheme='green' className="me-2" onClick={openGoogleForm}>Enroll</Button>
            <Button colorScheme='yellow' onClick={()=>{
                  navigate("/subcriptioncard");
            }}>Buy Premium</Button>
          </div>
        </div>
      </CardBody>
    </Card> 
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
  card: {
    maxWidth: "800px",
    width: "100%",
    marginBottom: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    cursor: "default",
  },
  avatar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "1rem",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  userProfileIcon: {
    marginRight: "0.5rem",
    fontSize: "1.5rem",
    color: "#777",
  },
  title: {
    fontWeight: "bold",
    fontSize: "1.2rem",
    marginTop: "0.5rem",
  },
  qualification: {
    fontStyle: "italic",
    fontSize: "0.8rem",
    marginLeft: "0.5rem",
    color: "#777",
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: "1rem",
  },
  buttons: {
    display: "flex",
  },
};

export default MentorPage;
