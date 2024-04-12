import { React, useState, useEffect } from 'react'
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { updateProfile } from '../../controllers/UpdateProfileController'
import { viewProfile } from '../../controllers/ViewProfile';
import Spinner from "./Spinner";
import { Input, Textarea } from '@chakra-ui/react'

const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // Initial skills array
  const [bio, setBio] = useState();
  const [skills, setSkills] = useState();
  const [links, setLinks] = useState();
  const [experiences, setExperiences] = useState();
  const [interests, setInterests] = useState();

  // Function to update a skill
  const updateSkill = (index, newValue) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = newValue;
    setSkills(updatedSkills);
  };

  // Function to delete a skill
  const deleteSkill = (index) => {
    const filteredSkills = skills.filter((_, i) => i !== index);
    setSkills(filteredSkills);
  };

  // Function to update a interests
  const updateLinks = (index, newValue) => {
    const updatedLinks = [...links];
    updatedLinks[index] = newValue;
    setLinks(updatedLinks);
  };

  // Function to delete a interests
  const deleteLinks = (index) => {
    const filteredLinks = links.filter((_, i) => i !== index);
    setLinks(filteredLinks);
  };

  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const saveExperience = (updatedExperience) => {
    if (isAdding) {
      setExperiences([...experiences, updatedExperience]);
    } else {
      const updatedExperiences = experiences.map((exp, i) => i === selectedExperienceIndex ? updatedExperience : exp);
      setExperiences(updatedExperiences);
    }
    closeModal();
  };

  // Function to delete a experience
  const deleteExperience = (index) => {
    const filteredExperience = experiences.filter((_, i) => i !== index);
    setExperiences(filteredExperience);
  };

  const openModalForEdit = (index) => {
    setIsAdding(false);
    setSelectedExperienceIndex(index);
  };

  const openModalForAdd = () => {
    setIsAdding(true);
    setSelectedExperienceIndex(null); // Ensure no experience is selected for edit
  };

  const closeModal = () => {
    setSelectedExperienceIndex(null);
    setIsAdding(false);
  };

  // Function to update a interests
  const updateInterests = (index, newValue) => {
    const updatedInterests = [...interests];
    updatedInterests[index] = newValue;
    setInterests(updatedInterests);
  };

  // Function to delete a interests
  const deleteInterests = (index) => {
    const filteredInterests = interests.filter((_, i) => i !== index);
    setInterests(filteredInterests);
  };

  const sumbitChanges = async () => {
    const profileData = {
      bio,
      pastExperiences: experiences,
      skills,
      interests,
      links
    }
    const token = sessionStorage.getItem("token")
    setLoading(true); // Set loading to true before making the API call
    try {
      const response = await updateProfile(profileData, token);
      alert(response.message);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false); // Set loading back to false after the API call completes
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      setLoading(true)
      try {
        const response = await viewProfile(token);
        const profileData = response.data;
        setData(profileData);
        setInterests(profileData.interests);
        setSkills(profileData.skills);
        setLinks(profileData.links);
        setExperiences(profileData.pastExperiences);
        setBio(profileData.bio);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [])

  return (
    <div className="container d-flex justify-content-center p-3 ">
      <div
        className="spinner"
        style={{
          margin: "auto",
          justifyContent: "center",
          display: !data ? "block" : "none",
        }}
      >
        <Spinner />
      </div>

      {
        data &&
        <div className="d-flex flex-column" style={{ width: "50rem" }}>
          <h4 className='text-center'>Edit Profile</h4>

          {/* Name, Bio, Links */}
          <div className='card p-2 mb-3'>
            <div className='d-flex flex-column gap-1 mb-3'>
              <label htmlFor="bio">Bio</label>
              <Input size='md' className="form-control" type="text" id="bio" name="bio" placeholder="Enter Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <div className='d-flex flex-column gap-1 mb-3'>
              <label htmlFor="links">Links</label>
              <div className='d-flex flex-column flex-wrap gap-3'>
                <div className='d-flex flex-wrap gap-3'>
                  {links?.map((link, index) => (
                    <div className='d-flex gap-1' key={index}>
                      <Input size='md'
                        type="text"
                        value={link}
                        onChange={(e) => updateLinks(index, e.target.value)}
                        className='form-control'
                      />
                      <button className='btn btn-danger btn-sm' onClick={() => deleteLinks(index)}><MdDeleteOutline /></button>
                    </div>
                  ))}
                </div>
                <button className='btn btn-primary btn-sm w-50 m-auto' onClick={() => setLinks([...skills, ''])}>Add New Link</button>
              </div>
            </div>
          </div>

          {/* skills */}
          <div className='card p-2 d-flex flex-column gap-1 mb-3'>
            <label>Skills</label>
            <div className='d-flex flex-column flex-wrap gap-3'>
              <div className='d-flex flex-wrap gap-3'>
                {skills?.map((skill, index) => (
                  <div className='d-flex gap-1' key={index}>
                    <Input size='md'
                      type="text"
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      className='form-control'
                    />
                    <button className='btn btn-danger btn-sm' onClick={() => deleteSkill(index)}><MdDeleteOutline /></button>
                  </div>
                ))}
              </div>
              <button className='btn btn-primary btn-sm w-50 m-auto' onClick={() => setSkills([...skills, ''])}>Add New Skill</button>
            </div>
          </div>

          {/* experiences */}
          <div className='card p-2 d-flex flex-column gap-1 mb-3' >
            <label>Experiences</label>
            {experiences?.map((experience, index) => (
              <div className='card p-2 d-flex flex-row align-items-center gap-2' key={index} >
                <span>{experience.company} </span>
                <MdEdit className='ms-auto text-success' style={{ cursor: 'pointer' }} onClick={() => openModalForEdit(index)} />

                <MdDeleteOutline className='text-danger' style={{ cursor: 'pointer' }} onClick={() => deleteExperience(index)} />
              </div>


            ))}
            <button className='btn btn-primary btn-sm w-50 m-auto mt-2' onClick={openModalForAdd}>Add Experience</button>
            {(selectedExperienceIndex !== null || isAdding) && (
              <ExperienceModal
                experience={isAdding ? null : experiences[selectedExperienceIndex]}
                onSave={saveExperience}
                onClose={closeModal}
              />
            )}
          </div>

          {/* Interests */}
          <div className='card p-2 d-flex flex-column gap-1 mb-3'>
            <label>Interests</label>
            <div className='d-flex flex-column flex-wrap gap-3'>
              <div className='d-flex flex-wrap gap-3'>
                {interests?.map((interest, index) => (
                  <div className='d-flex gap-1' key={index}>
                    <Input size='md'
                      type="text"
                      value={interest}
                      onChange={(e) => updateInterests(index, e.target.value)}
                      className='form-control'
                    />
                    <button className='btn btn-danger btn-sm' onClick={() => deleteInterests(index)}><MdDeleteOutline /></button>
                  </div>
                ))}
              </div>
              <button className='btn btn-primary btn-sm w-50 m-auto' onClick={() => setInterests([...interests, ''])}>Add New Interest</button>
            </div>

          </div>

          <Input size='md' type="submit" value="Save Changes" onClick={sumbitChanges} className='btn btn-success m-auto' style={{ display: loading ? "none" : "block" }} />
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
      }
    </div>
  )
}

export default EditProfile



const ExperienceModal = ({ experience, onSave, onClose }) => {
  // Initialize local state with experience or empty fields for a new experience
  const [localExperience, setLocalExperience] = useState(experience || {
    jobTitle: '',
    company: '',
    duration: '',
    description: ''
  });

  const handleChange = (field, value) => {
    setLocalExperience({ ...localExperience, [field]: value });
  };

  const style = {
    model: {
      height: "100vh",
      width: "100vw",
      backgroundColor: "rgba(0, 0, 0,.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "fixed",
      top: "0",
      left: "0",
      zIndex: "10"
    },
    modelContent: {
      backgroundColor: "white",
      padding: "2rem",
      display: 'flex',
      flexDirection: "column",
      gap: "2rem",
      width: "50rem",
      borderRadius: ".5rem"
    }
  }

  return (
    <div className='animate__animated animate__fadeIn' style={style.model}>
      <div style={style.modelContent} className='shadow'>

        <Input size='md'
          type="text"
          placeholder="Job Title"
          value={localExperience.jobTitle}
          onChange={(e) => handleChange('jobTitle', e.target.value)}
          className='form-control'
        />
        <Input size='md'
          type="text"
          placeholder="Company"
          value={localExperience.company}
          onChange={(e) => handleChange('company', e.target.value)}
          className='form-control'
        />
        <Input size='md'
          type="text"
          placeholder="Duration"
          value={localExperience.duration}
          onChange={(e) => handleChange('duration', e.target.value)}
          className='form-control'
        />
        <Textarea
          placeholder="Description"
          value={localExperience.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className='form-control'
        />
        <button className='btn btn-success' onClick={() => onSave(localExperience)}>Save</button>
        <button className="btn btn-danger" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};