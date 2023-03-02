import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import './NavBar.css';
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import Link from '../Link/Link';
import { useContext, useState } from "react";
import UserContext from '../../lib/usercontext';
import SearchContext from '../../lib/searchcontext';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { IconButton, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BadgeIcon from '@mui/icons-material/Badge';
import GroupsIcon from '@mui/icons-material/Groups';
import BiotechIcon from '@mui/icons-material/Biotech';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import FolderIcon from '@mui/icons-material/Folder';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';
import ReportIcon from '@mui/icons-material/Report';
import BlockIcon from '@mui/icons-material/Block';

//const Search = styled('div')(({ theme }) => ({
//position: 'relative',
//borderRadius: theme.shape.borderRadius,
//backgroundColor: alpha(theme.palette.common.white, 0.15),
//'&:hover': {
//backgroundColor: alpha(theme.palette.common.white, 0.25),
//},
//marginRight: theme.spacing(2),
//marginLeft: 0,
//width: '100%',
//}));

//const SearchIconWrapper = styled('div')(({ theme }) => ({
//padding: theme.spacing(0, 2),
//height: '100%',
//position: 'absolute',
//pointerEvents: 'none',
//display: 'flex',
//alignItems: 'center',
//justifyContent: 'center',
//}));

//const StyledInputBase = styled(InputBase)(({ theme }) => ({
//color: 'inherit',
//'& .MuiInputBase-input': {
//padding: theme.spacing(1, 1, 1, 0),
//// vertical padding + font size from searchIcon
//paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//transition: theme.transitions.create('width'),
//width: '100%',
//[theme.breakpoints.up('md')]: {
//width: '20ch',
//},
//},
//}));


export default function NavBar() {


    const [user, setUser] = useContext(UserContext);

    const [search, setSearch] = useContext(SearchContext);

    const navigate = useNavigate();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    let toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    }

    let searchQuestions = (searchValue) => {
        setSearch(searchValue);
        navigate("/questions");
    }

    return (
        <div className="navbar">
            <div className="navbar-logo">

                {user && (user.type == "admin" || user.type == "staff") ?
                    <MenuIcon onClick={toggleDrawer} style={{ color: "white", fontSize: '30px', marginRight: '20px' }} />
                    :
                    <></>
                }

                <Link to="/">
                    <QuestionAnswerIcon style={{ color: "white", fontSize: '30px' }} />
                </Link>
                <h3>querybox</h3>
            </div>
            <div className="navbar-search">
                <input className="search-bar" value={search} onChange={(event) => searchQuestions(event.target.value)} placeholder="Search Questions" />
            </div>
            <div className="navbar-actions">
                {!user ?
                    <>
                        <Link to="/topics">
                            <Button color="white" variant="outlined">Topics</Button>
                        </Link>
                        <Link to="/login">
                            <Button color="white" variant="outlined">Login</Button>
                        </Link>
                        <Link to="/register">
                            <Button color="white" variant="outlined">Register</Button>
                        </Link>
                    </>
                    :
                    <>
                        <Link to="/topics">
                            <Button color="white" variant="outlined">Topics</Button>
                        </Link>
                        {user && user.customer_id &&
                            <Link to="/profile">
                                <Button color="white" variant="outlined">Profile</Button>
                            </Link>
                        }
                        <Link to="/logout">
                            <Button color="white" variant="outlined">Logout</Button>
                        </Link>
                    </>
                }
            </div>

            {user && (user.type == "admin" || user.type == "staff") &&
                <Drawer
                    anchor={"left"}
                    open={isDrawerOpen}
                    onClose={() => { setIsDrawerOpen() }}
                >
                    <div className="drawer">
                        <h1 className="drawer-title">{user.type} Dashboard </h1>
                        <List onClick={() => { setIsDrawerOpen() }}>
                            {["admin"].includes(user.type) &&
                                <Link to="/admin/users" >
                                    <ListItem disablePadding>
                                        <ListItemButton selected={location.pathname == "/admin/users"}>
                                            <ListItemIcon>
                                                <AccountCircleIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={"Users"} />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            }

                            {["admin"].includes(user.type) &&
                                <Link to="/admin/staff" >
                                    <ListItem disablePadding>
                                        <ListItemButton selected={location.pathname == "/admin/staff"}>
                                            <ListItemIcon>
                                                <BadgeIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={"Staff"} />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            }

                            {["admin", "staff"].includes(user.type) &&
                                <Link to="/admin/customer" >
                                    <ListItem disablePadding>
                                        <ListItemButton selected={location.pathname == "/admin/customer"}>
                                            <ListItemIcon>
                                                <GroupsIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={"Customers"} />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            }

                            {["admin", "staff"].includes(user.type) &&
                                <Link to="/admin/category" >
                                    <ListItem disablePadding>
                                        <ListItemButton selected={location.pathname == "/admin/category"}>
                                            <ListItemIcon>
                                                <BiotechIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={"Category"} />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            }

                            {["admin", "staff"].includes(user.type) &&
                                <Link to="/admin/topics" >
                                    <ListItem disablePadding>
                                        <ListItemButton selected={location.pathname == "/admin/topics"}>
                                            <ListItemIcon>
                                                <AutoStoriesIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={"Topics"} />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            }

                            {["admin", "staff"].includes(user.type) &&
                                <Link to="/admin/questions" >
                                    <ListItem disablePadding>
                                        <ListItemButton selected={location.pathname == "/admin/questions"}>
                                            <ListItemIcon>
                                                <QuestionMarkIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={"Questions"} />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            }

                            {["admin", "staff"].includes(user.type) &&
                                <Link to="/admin/answers" >
                                    <ListItem disablePadding>
                                        <ListItemButton selected={location.pathname == "/admin/answers"}>
                                            <ListItemIcon>
                                                <QuestionAnswerIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={"Answers"} />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            }

                            {["admin", "staff"].includes(user.type) &&
                                <Link to="/admin/files" >
                                    <ListItem disablePadding>
                                        <ListItemButton selected={location.pathname == "/admin/files"}>
                                            <ListItemIcon>
                                                <FolderIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={"Files"} />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            }

                            {["admin", "staff"].includes(user.type) &&
                                <Link to="/admin/votes" >
                                    <ListItem disablePadding>
                                        <ListItemButton selected={location.pathname == "/admin/votes"}>
                                            <ListItemIcon>
                                                <ThumbsUpDownIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={"Votes"} />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            }

                            {["admin", "staff"].includes(user.type) &&
                                <Link to="/admin/comments" >
                                    <ListItem disablePadding>
                                        <ListItemButton selected={location.pathname == "/admin/comments"}>
                                            <ListItemIcon>
                                                <ChatIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={"Comments"} />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            }

                            {["admin", "staff"].includes(user.type) &&
                                <Link to="/admin/history" >
                                    <ListItem disablePadding>
                                        <ListItemButton selected={location.pathname == "/admin/history"}>
                                            <ListItemIcon>
                                                <HistoryIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={"History"} />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            }

                            {["admin", "staff"].includes(user.type) &&
                                <Link to="/admin/complaints" >
                                    <ListItem disablePadding>
                                        <ListItemButton selected={location.pathname == "/admin/complaints"}>
                                            <ListItemIcon>
                                                <ReportIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={"Complaints"} />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            }

                            {
                                //["admin", "staff"].includes(user.type) &&
                                //<Link to="/admin/banned" >
                                    //<ListItem disablePadding>
                                        //<ListItemButton selected={location.pathname == "/admin/banned"}>
                                            //<ListItemIcon>
                                                //<BlockIcon />
                                            //</ListItemIcon>
                                            //<ListItemText primary={"Banned Posts"} />
                                        //</ListItemButton>
                                    //</ListItem>
                                //</Link>
                            }

                        </List>

                    </div>
                </Drawer>
            }
        </div>
    );
}

          //<Search>
            //<SearchIconWrapper>
              //<SearchIcon />
            //</SearchIconWrapper>
            //<StyledInputBase
              //placeholder="Search…"
              //inputProps={{ 'aria-label': 'search' }}
            ///>
          //</Search>
