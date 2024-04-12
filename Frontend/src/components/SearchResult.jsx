import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom";
import { Card, Heading, Divider, CardBody, Stack, Badge, Text, Image, Button } from '@chakra-ui/react'
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import { followUser } from '../../controllers/UserController.js'
import {viewProfile} from '../../controllers/ViewProfile.js'
import { jwtDecode } from "jwt-decode";

const SearchResult = () => {
  const location = useLocation();
  const data = location.state?.data;
  const [users, setUsers] = useState(null);
  const [startups, setStartups] = useState(null);
  const myId = jwtDecode(sessionStorage.getItem("token")).id;

  const randomImage = ["https://xsgames.co/randomusers/avatar.php?g=female", "https://xsgames.co/randomusers/avatar.php?g=male"]

  const selectRamdomImage = () => {
    return randomImage[Math.floor(Math.random() * randomImage.length)];
  }

  const followHandler = async (userId)=>{
    const token = sessionStorage.getItem("token");
    console.log("Follow user handler", userId)
    let myProfile;
    try {
      const response = await viewProfile(token);
      myProfile=response.data;
      console.log(response.data)
    } catch (error) {
      alert(error.message);
    }
    const myFollowers = myProfile.user.following.users
    console.log(myProfile.user.following.users)
    const isFollower = myFollowers.includes(userId)

    try {
      console.log("Challo Follow Karayla")
      const response = await followUser(userId, !isFollower, token);
      console.log(response)
    } catch (error) {
      alert(error.message);
    } finally {

    }
  }

  function filterDataByRole(data) {
    const filteredData = {
      user: [],
      startup: []
    };

    data.forEach(entry => {
      if (entry.role === "user") {
        const userData = {
          _id: entry._id,
          user:entry.user._id,
          name: entry.name,
          emailId: entry.emailId,
          profilePhotoURL: entry.profilePhotoURL,
          bio: entry.bio,
          links: entry.links,
          skills: entry.skills,
          interests: entry.interests,
          pastExperiences: entry.pastExperiences,
          isFollow: entry.user.followers.users.includes(myId)
        };
        filteredData.user.push(userData);
      } else if (entry.role === "startup") {
        const startupData = {
          user: entry.user,
          name: entry.name,
          emailId: entry.emailId,
          startupName: entry.startupName,
          description: entry.description,
          missionStatement: entry.missionStatement,
          founders: entry.founders,
          industry: entry.industry,
          location: entry.location,
          websiteUrl: entry.websiteUrl,
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt,
          isFollow: entry.user.followers.users.includes(myId)

        };
        filteredData.startup.push(startupData);
      }
    });

    return filteredData;
  }

  useEffect( () => {
    const filteredData = filterDataByRole(data);
    setUsers(filteredData.user);
    console.log(data,"response madhle ala aahe")
    setStartups(filteredData.startup)
  }, [data])

  return (
    <div className="container mt-3">
      {
        users?.length > 0 &&
        <div>
          <h4>Users</h4>
          <div className='d-flex flex-wrap gap-3'>
            {
              users?.map((user, i) => {
                const img = selectRamdomImage();
                console.log("Users", user)
                return (
                  <UserCard key={user.user} _id={user.user} name={user.name} bio={user.bio} skills={user.skills} img={img} isFollow={user?.isFollow} followHandler={followHandler}/>
                )
              })
            }
          </div>
          <Divider />
        </div>
      }



      {
        startups?.length > 0 &&
        <div className='mt-3'>
          <h4>Startups</h4>
          <div className='d-flex flex-wrap gap-3'>
            {
              startups?.map((startup, i) => {
                const img = selectRamdomImage();
                console.log("Startups", startup)
                return (
                  <StartUpCard _id={startup.user} startupName={startup.startupName} description={startup.description} offerings={startup.offerings} img={img} isFollow={startup.isFollow} followHandler={followHandler}/>
                )
              })
            }
          </div>
        </div>
      }
    </div>
  )
}

export default SearchResult

const UserCard = ({ _id, name, bio, skills, img, isFollow, followHandler }) => {
  return (
    <Card maxW='sm' style={{ width: "30rem" }}>
      <CardBody>
        <Image
          src={img}
          alt='image'
          borderRadius='lg'
          style={{ textAlign: "center", margin: "auto" }}
        />
        <Stack mt='6' spacing='3'>
          <Heading size='md'>{name}</Heading>
          <Text>
            {bio}
          </Text>

          {
            isFollow ?
              <Button colorScheme='blue' style={{ position: "absolute", top: "4px", right: "4px" }} leftIcon={<SlUserFollow />} onClick={()=>followHandler(_id)}
              >Unfollow
              </Button> :

              <Button colorScheme='blue' style={{ position: "absolute", top: "4px", right: "4px" }} leftIcon={<SlUserUnfollow />} onClick={()=>followHandler(_id)}
              >Follow
              </Button>
          }
          <div className='d-flex gap-3 flex-wrap'>
            {
              skills?.map((skill, index) => {
                return (
                  <Badge colorScheme='purple' key={index}>{skill}</Badge>
                )
              })
            }
          </div>

        </Stack>
      </CardBody>
    </Card>
  )
}


const StartUpCard = ({ startupName, description, offerings, img, isFollow, followHandler, _id }) => {
  return (
    <Card maxW='sm' style={{ width: "30rem" }}>
      <CardBody >
        <Image
          src={img}
          alt='user image'
          borderRadius='lg'
          style={{ textAlign: "center", margin: "auto" }}
        />
        <Stack mt='6' spacing='3' style={{ height: " 80%" }}>
          <Heading size='md'>{startupName}</Heading>
          <Text>
            {description}
          </Text>
          {
            isFollow ?
              <Button colorScheme='blue' style={{ position: "absolute", top: "4px", right: "4px" }} leftIcon={<SlUserFollow />} onClick={()=>followHandler(_id)}
              >UnFollow
              </Button> :

              <Button colorScheme='blue' style={{ position: "absolute", top: "4px", right: "4px" }} leftIcon={<SlUserUnfollow />} onClick={()=>followHandler(_id)}
              >Follow
              </Button>
          }
          <div className='d-flex gap-3 flex-wrap'>
            {
              offerings?.map((offering, index) => {
                return (
                  <Badge colorScheme='purple' key={index}>{offering}</Badge>
                )
              })
            }
          </div>

        </Stack>
      </CardBody>
    </Card>
  )
}
