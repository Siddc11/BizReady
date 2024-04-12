import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { Divider, Box, AbsoluteCenter, Tooltip } from "@chakra-ui/react";
import ProfileOptionsTab from "./ProfileOptionsTab";
import AllPosts from "./AllPosts";
import AddMentorships from "./AddMentorships.jsx";

import { viewProfile } from "../../controllers/StartupController.js";

const StartupProfile = () => {
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
        if (response.data?.isRegistered === false) {
          navigate("/edit-startup-profile");
          return;
        }
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
              src="https://t3.ftcdn.net/jpg/06/17/13/26/360_F_617132669_YptvM7fIuczaUbYYpMe3VTLimwZwzlWf.jpg"
              style={styles.profileImage}
            ></img>
          </div>
          <div style={styles.profileDetailsSection} className="container">
            <div>
              <h2 className="text-center">{data?.startupName}</h2>
              <p className="text-center">{data?.missionStatement}</p>
              <Divider orientation="horizontal" />
              <p>{data?.description}</p>
              <a
                href={data?.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Vist Website
              </a>

              <div className="mt-3">
                <h4>Social Media</h4>
                <div className="d-flex gap-3 links">
                  {Object.entries(data?.contactInformation?.socialMedia).map(
                    ([platform, url]) => (
                      <a
                        href={url}
                        key={platform}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        {platform}
                      </a>
                    )
                  )}
                </div>
              </div>

              <Box position="relative">
                <Divider />
                <AbsoluteCenter bg="white" px="4">
                  <span className="fw-bold">Contact</span>
                </AbsoluteCenter>
              </Box>
              <div className="d-flex flex-wrap gap-2">
                <p>
                  <span className="fw-bold">Address:</span> {data?.location}
                </p>
                <p>
                  <span className="fw-bold"> • Phone:</span>{" "}
                  {data?.contactInformation?.phone}
                </p>
                <p>
                  <span className="fw-bold"> • Email:</span>{" "}
                  {data?.contactInformation?.email}
                </p>
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
              data-bs-toggle="tooltip"
              data-bs-title="Edit Profie"
              style={{ ...styles.editBtn, marginBottom: "80px" }}
              onClick={() => {
                navigate("/edit-startup-profile");
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

export default StartupProfile;
const RenderProfileDetails = ({ data }) => {
  return (
    <div className="container p-0">
      <div>
        {data && (
          <>
            {data?.founders && data?.founders?.length > 0 ? (
              <div style={styles.section}>
                <h4>Founders</h4>
                <div className="d-flex gap-2 flex-wrap">
                  {data?.founders.map((founder, index) => (
                    <div
                      key={index}
                      className="card p-2"
                      style={{ width: "13rem" }}
                    >
                      <h5>
                        {founder?.name} •{" "}
                        <span className="fs-6 fw-normal">{founder?.role}</span>{" "}
                      </h5>
                      <p>{founder?.bio}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={styles.section}>
                <h4>Founders</h4>
                <div className="d-flex gap-2 flex-wrap">
                  No Founders to show
                </div>
              </div>
            )}

            {data?.offerings && data?.offerings?.length > 0 ? (
              <div style={styles.section}>
                <h4>Offerings</h4>
                <div className="d-flex flex-wrap gap-2">
                  {data.offerings.map((offering, index) => (
                    <h5 key={index}>
                      <span className="badge bg-secondary">{offering}</span>
                    </h5>
                  ))}
                </div>
              </div>
            ) : (
              <div style={styles.section}>
                <h4>Offerings</h4>
                <div className="d-flex gap-2 flex-wrap">
                  No Offerings to show
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div style={styles.section}>
        <h4>Add Mentorship Programs</h4>
        <AddMentorships />
      </div>
    </div>
  );
};

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
    backgroundImage: `url("https://t3.ftcdn.net/jpg/00/32/43/82/360_F_32438200_oMeluL7Q2cR50GALrJQMCwgYImFK7hkl.jpg")`,
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
