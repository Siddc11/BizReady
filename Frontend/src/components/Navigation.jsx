import React, { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { LoginContext } from '../context/LoginContext.js';
import logoBiz from "../assests/logoBiz.png";
import {
    Input, InputGroup, InputRightElement, Tooltip, Alert,
    AlertIcon,
    AlertDescription
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';

import { SearchIcon } from '@chakra-ui/icons'
import { TbLogout } from "react-icons/tb";
import { getSearchResult } from '../../controllers/SearchController.js'
import '../App.css'

const Navigation = () => {
    const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
    const navigate = useNavigate();

    const logout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false)
    }
    const role = sessionStorage.getItem("role");
    const [searchInput, setSearchInput] = useState('')
    const handleChange = (event) => setSearchInput(event.target.value)
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const handleSearch = async () => {
        if (searchInput == "") {
            setError(true)
            setErrorMsg("Search field is empty!")
            setTimeout(() => {
                setError(false)
            }, 3000)
            return
        } else {
            try {
                const data = {
                    searchQuery: searchInput
                }
                const token = sessionStorage.getItem("token")
                const response = await getSearchResult(data, token);
                // Additional logic after successful login, if needed
                navigate('/search-result', { state: { data: response.data } })
                console.log("Search Result:", response.data);
            } catch (error) {
                alert(error.message);
                console.error("Something went wrong:", error.message);
                // Additional error handling logic if needed
            } finally {
                // setLoading(false); // Set loading back to false after the API call completes
                setSearchInput("")
            }
        }
    }
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{ position: "sticky", top: "0", zIndex: "1" }}>
            <div className="container">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <img style={{ height: "15%", width: "30%" }} src={logoBiz} alt="logo" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                      
                    <li className="nav-item">
                            {isLoggedIn && <NavLink
                                to="/mentorpage"
                                className={({ isActive }) =>
                                    `${isActive ? "nav-link-active" : null} nav-link`
                                }
                            >
                                Programs
                            </NavLink>}
                        </li>

                        <li className="nav-item">
                            {isLoggedIn && <NavLink
                                to="/blog"
                                className={({ isActive }) =>
                                    `${isActive ? "nav-link-active" : null} nav-link`
                                }
                            >
                                Blog
                            </NavLink>}
                        </li>

                        <li className="nav-item">
                            {isLoggedIn && <NavLink
                                to="/feed"
                                className={({ isActive }) =>
                                    `${isActive ? "nav-link-active" : null} nav-link`
                                }
                            >
                                Explore
                            </NavLink>}
                        </li>

                        <li className="nav-item">
                            {isLoggedIn && <NavLink
                                to="/chat"
                                className={({ isActive }) =>
                                    `${isActive ? "nav-link-active" : null} nav-link`
                                }
                            >
                                Chat
                            </NavLink>}
                        </li>


                        {

                            !isLoggedIn &&
                            <li className="nav-item">
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        `${isActive ? "nav-link-active" : null} nav-link`
                                    }
                                >
                                    Login
                                </NavLink>
                            </li>
                        }

                        {
                            isLoggedIn &&
                            <>

                                <li className="nav-item">
                                    <NavLink
                                        to={`${role == "user" ? '/profile-details' : role == "startup" ? "/startup-profile" : "/"}`}
                                        className={({ isActive }) =>
                                            `${isActive ? "nav-link-active" : null} nav-link`
                                        }
                                    >
                                        Profile
                                    </NavLink>
                                </li>

                                <li className="ms-3">

                                    <InputGroup size='md'>
                                        <Input
                                            pr='4.5rem'
                                            type="text"
                                            placeholder='Search'
                                            value={searchInput}
                                            onChange={handleChange}
                                        />
                                        <InputRightElement width='4.5rem'>
                                            <SearchIcon onClick={handleSearch} style={{ cursor: "pointer" }} />
                                        </InputRightElement>
                                    </InputGroup>
                                </li>

                                <li className="nav-item">
                                    <Tooltip label='logout' fontSize='md' openDelay={500}>
                                        <NavLink
                                            to="/login"
                                            className={({ isActive }) =>
                                                `${isActive ? "nav-link-active" : null} nav-link`
                                            }
                                            onClick={logout}
                                        >

                                            <TbLogout className="fs-3 text-danger" />
                                        </NavLink>
                                    </Tooltip>
                                </li>

                            </>
                        }
                    </ul>
                </div>
            </div>

            {
                error &&
                <Alert status='error' className="animate__animated animate__fadeInRight" style={{ position: "fixed", right: "20px", top: "5rem", width: "20rem" }}>
                    <AlertIcon />
                    <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
            }
        </nav>
    );
};

export default Navigation;
