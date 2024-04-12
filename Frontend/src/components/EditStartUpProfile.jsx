import { React, useState, useEffect } from "react";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import Spinner from "./Spinner";
import { Modal, Button } from 'react-bootstrap';
import { viewProfile, updateProfile } from '../../controllers/StartupController.js';
import { Input, Textarea } from '@chakra-ui/react'


const EditStartUpProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentFounder, setCurrentFounder] = useState({});
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState(null);

  const openFounderModal = (index) => {
    setCurrentFounder({ index, ...data.founders[index] });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle changes in nested contact information
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      contactInformation: {
        ...prevData.contactInformation,
        [name]: value,
      },
    }));
  };

  // Offerings Handlers
  const updateOffering = (index, value) => {
    const updatedOfferings = [...data.offerings];
    updatedOfferings[index] = value;
    setData({ ...data, offerings: updatedOfferings });
  };

  const deleteOffering = (index) => {
    const filteredOfferings = data.offerings.filter((_, i) => i !== index);
    setData({ ...data, offerings: filteredOfferings });
  };

  const addOffering = () => {
    setData({ ...data, offerings: [...data.offerings, ""] });
  };

  const deleteFounder = (index) => {
    const filteredFounders = data.founders.filter((_, i) => i !== index);
    setData({ ...data, founders: filteredFounders });
  };

  const addFounder = () => {
    setData({
      ...data,
      founders: [...data.founders, { name: "", role: "", bio: "" }],
    });
    openFounderModal(data?.founders.length);
  };

  const saveFounderDetails = () => {
    const updatedFounders = [...data.founders];
    updatedFounders[currentFounder.index] = {
      name: currentFounder.name,
      role: currentFounder.role,
      bio: currentFounder.bio,
    };
    setData({ ...data, founders: updatedFounders });
    setShowModal(false);
  };

  const handleFounderChange = (field, value) => {
    setCurrentFounder((prev) => ({ ...prev, [field]: value }));
  };

  // Social Media Handlers
  const updateSocialMediaLink = (platform, url) => {
    setData({
      ...data,
      contactInformation: {
        ...data.contactInformation,
        socialMedia: {
          ...data.contactInformation.socialMedia,
          [platform]: url,
        },
      },
    });
  };

  const sumbitChanges = async () => {
    const token = sessionStorage.getItem("token");
    setLoading(true); // Set loading to true before making the API call
    try {
      const response = await updateProfile(data, token);
      alert(response.message);
      console.log(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false); // Set loading back to false after the API call completes
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      setLoading(true);
      try {
        const response = await viewProfile(token);
        const profileData = response.data;
        setData(profileData);
        console.log(profileData);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container d-flex justify-content-center p-3">
      {data && (
        <div className="d-flex flex-column" style={{ width: "50rem" }}>
          <h4 className="text-center">Edit Profile</h4>

          <div className='d-flex flex-column gap-1 mb-3'>
            <label htmlFor="startupName">Name</label>
            <Input className="form-control" type="text" id="name" name="startupName" placeholder="Enter Startup Name" value={data?.startupName} onChange={handleChange} />
          </div>

          <div className='d-flex flex-column gap-1 mb-3'>
            <label htmlFor="description">Description</label>
            <Input className="form-control" type="text" id="description" name="description" placeholder="Enter Your Description" value={data?.description} onChange={handleChange} />
          </div>

          <div className='d-flex flex-column gap-1 mb-3'>
            <label htmlFor="missionStatement">Mission</label>
            <Input className="form-control" type="text" id="missionStatement" name="missionStatement" placeholder="Enter Your Mission" value={data?.missionStatement} onChange={handleChange} />
          </div>

          <div className='d-flex flex-column gap-1 mb-3'>
            <label htmlFor="email">Email</label>
            <Input className="form-control" type="email" id="email" name="email" placeholder="Enter Your Email" value={data?.contactInformation?.email} onChange={handleContactChange} />
          </div>

          <div className='d-flex flex-column gap-1 mb-3'>
            <label htmlFor="phone">Phone</label>
            <Input className="form-control" type="text" id="phone" name="phone" placeholder="Enter Your Phone Number" value={data?.contactInformation?.phone} onChange={handleContactChange} />
          </div>

          <div className='d-flex flex-column gap-1 mb-3'>
            <label htmlFor="location">Location</label>
            <Input className="form-control" type="text" id="location" name="location" placeholder="Enter Your Location" value={data?.location} onChange={handleChange} />
          </div>

          <div className='d-flex flex-column gap-1 mb-3'>
            <label htmlFor="websiteUrl">Website</label>
            <Input className="form-control" type="text" id="websiteUrl" name="websiteUrl" placeholder="Enter Your Website URL" value={data?.websiteUrl} onChange={handleChange} />
          </div>

          <div className='d-flex flex-column gap-1 mb-3'>
            <label htmlFor="industry">Industry</label>
            <Input className="form-control" type="text" id="industry" name="industry" placeholder="Enter Your Industry" value={data?.industry} onChange={handleChange} />
          </div>

          <div className='card p-2 d-flex flex-column gap-1 mb-3'>
            <label>Offerings</label>
            <div className='d-flex flex-column flex-wrap gap-3'>
              <div className='d-flex flex-wrap gap-3'>
                {data?.offerings?.map((offering, index) => (
                  <div className='d-flex gap-1' key={index}>
                    <Input
                      type="text"
                      value={offering}
                      onChange={(e) => updateOffering(index, e.target.value)}
                      className='form-control'
                    />
                    <button className='btn btn-danger btn-sm'
                      onClick={() => deleteOffering(index)}
                    >
                      <MdDeleteOutline /></button>
                  </div>
                ))}
              </div>
              <button className='btn btn-primary btn-sm w-50 m-auto'
                onClick={addOffering}
              >
                Add New Offering
              </button>
            </div>
          </div>

          <div className="card p-2 d-flex flex-column gap-1 mb-3">
            <label>Founders</label>
            <div>
              {data?.founders?.map((founder, index) => (
                <div
                  key={index}
                  className="card p-2 d-flex flex-row align-items-center gap-2 mb-2"
                >
                  <span>{founder.name}</span>
                  <MdEdit
                    className="ms-auto text-success"
                    style={{ cursor: "pointer" }}
                    onClick={() => openFounderModal(index)}
                  />

                  <MdDeleteOutline
                    className="text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => deleteFounder(index)}
                  />
                </div>
              ))}
            </div>

            <button
              className="btn btn-primary btn-sm w-50 m-auto"
              onClick={addFounder}
            >
              Add New Founder
            </button>
          </div>

          {/* Founder Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Founder</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Input
                type="text"
                className="form-control mb-2"
                value={currentFounder.name || ''}
                onChange={(e) => handleFounderChange('name', e.target.value)}
                placeholder="Name"
              />
              <Input
                type="text"
                className="form-control mb-2"
                value={currentFounder.role || ''}
                onChange={(e) => handleFounderChange('role', e.target.value)}
                placeholder="Role"
              />
              <Textarea
                className="form-control"
                value={currentFounder.bio || ''}
                onChange={(e) => handleFounderChange('bio', e.target.value)}
                placeholder="Bio"
              ></Textarea>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
              <Button variant="primary" onClick={saveFounderDetails}>Save Changes</Button>
            </Modal.Footer>
          </Modal>

          {/* Social Media Section */}
          <div className='card p-2 d-flex flex-column gap-1 mb-3'>
            <label>Social Media Links</label>
            <div className='d-flex flex-column gap-2'>
              {Object.entries(data?.contactInformation?.socialMedia).map(([platform, url]) => (
                <div key={platform} className='d-flex gap-1 align-items-center'>
                  <Input
                    type="text"
                    placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                    value={url}
                    onChange={(e) => updateSocialMediaLink(platform, e.target.value)}
                    className='form-control'
                  />
                </div>
              ))}
            </div>
          </div>
          <input type="submit" value="Save Changes" onClick={sumbitChanges} className='btn btn-success m-auto' style={{ display: loading ? "none" : "block" }} />
          <div
            className="spinner"
            style={{
              margin: "auto",
              justifyContent: "center",
              display: loading ? "block" : "none",
            }}
          >
            <Spinner />
          </div>
        </div>
            )}
    </div>
  )
}

export default EditStartUpProfile;
