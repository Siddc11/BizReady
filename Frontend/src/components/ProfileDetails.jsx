import React, { useEffect, useState } from "react";
import "../App.css";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { viewProfile } from "../../controllers/ViewProfile";
import Spinner from "./Spinner";
import ProfileOptionsTab from "./ProfileOptionsTab";
import AllPosts from "./AllPosts";
import { Tooltip } from '@chakra-ui/react'


const styles = {
  profileImage: {
    borderRadius: "50%",
    width: "200px",
    height: "200px",
    objectFit: "cover",
    position: "relative",
    bottom: "-5rem",
    border: ".3rem solid white",
  },
  profileImageContainer: {
    backgroundColor: "black",
    display: "flex",
    justifyContent: "center",
    backgroundImage: `url("https://trak.in/wp-content/uploads/2017/10/Entrepreneurship-Banner-Opt.jpg")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "15rem",
  },
  profileDetailsSection: {
    padding: "3rem 1rem 1rem 1rem",
    backgroundColor: "white",
    border: "1px solid rgb(219, 219, 219)",
    borderRadius: "0 0 1rem 1rem",
  },
  section: {
    border: "1px solid rgb(219, 219, 219)",
    backgroundColor: "white",
    padding: "1rem",
    margin: "1rem 0",
    borderRadius: "1rem",
  },
  editBtn: {
    position: "fixed",
    bottom: "4rem",
    right: "2rem",
    borderRadius: "10rem",
    fontSize: "1.3rem",
  },
};

const ProfileDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      setLoading(true); // Set loading to true before making the API call

      try {
        const response = await viewProfile(token);
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false); // Set loading back to false after the API call completes
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <div className="container">
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
      </div>
      {data && (
        <div className="animate__animated animate__fadeIn">
          <div style={styles.profileImageContainer} className="container">
            <img
              className="bg-light"
              src={data?.profilePhotoURL}
              style={styles.profileImage}
            ></img>
          </div>

          <div style={styles.profileDetailsSection} className="container">
            <div>
              <h2 className="text-center">{data?.name}</h2>
              <p>{data?.bio}</p>
              <div className="d-flex gap-3">
              <p><span className="fw-bold">{data?.user?.followers?.count}  </span>Followers</p>
              <p><span className="fw-bold">{data?.user?.following?.count}  </span>Following</p>
              </div>
              <div className="d-flex gap-3 links">
                {data?.links.map((link, index) => {
                  return (
                    <a
                      href={link}
                      key={index}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      Link
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="container mt-3">
            <ProfileOptionsTab
              firstTab={<RenderProfileDetails data={data} />}
              secondTab={<AllPosts />}
            />
          </div>

          <Tooltip label="Edit Profile" fontSize="md" openDelay={500}>
            <button
              className="btn btn-success"
              style={{ ...styles.editBtn, marginBottom: "80px" }} 
              onClick={() => {
                navigate("/edit-profile");
              }}
            >
              <MdEdit />
            </button>
          </Tooltip>
        </div>
      )}
    </>
  );
};

export default ProfileDetails;

const RenderProfileDetails = ({ data }) => {
  return (
    <div className="container p-0">
      <div>
        {data && (
          <>
            {data.pastExperiences && data.pastExperiences.length > 0 ? (
              <div style={styles.section}>
                <h4>Past Experience</h4>
                <div className="d-flex flex-wrap">
                  {data.pastExperiences.map((experience, index) => (
                    <div
                      key={index}
                      className="card p-2"
                      style={{ flex: `1 1 calc(50% - 20px)` }} // Adjusted style
                    >
                      <h5>{experience?.company}</h5>
                      <h6>
                        {experience.jobTitle} • {experience.duration}
                      </h6>
                      <p>{experience?.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={styles.section}>
                <h4>Past Experience</h4>
                <div className="d-flex gap-2 flex-wrap">
                  No experiences to show
                </div>
              </div>
            )}

            {data.skills && data.skills.length > 0 ? (
              <div style={styles.section}>
                <h4>Skills</h4>
                <div className="d-flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <h5 key={index}>
                      <span className="badge bg-secondary">{skill}</span>
                    </h5>
                  ))}
                </div>
              </div>
            ) : (
              <div style={styles.section}>
                <h4>Skills</h4>
                <div className="d-flex gap-2 flex-wrap">No Skills to show</div>
              </div>
            )}

            {data.interests && data.interests.length > 0 ? (
              <div style={styles.section}>
                <h4>Interests</h4>
                <div className="d-flex flex-wrap gap-2">
                  {data.interests.map((interest, index) => (
                    <h5 key={index}>
                      <span className="badge bg-secondary">{interest}</span>
                    </h5>
                  ))}
                </div>
              </div>
            ) : (
              <div style={styles.section}>
                <h4>Interests</h4>
                <div className="d-flex gap-2 flex-wrap">
                  No Interests to show
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
