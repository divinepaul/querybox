import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Button from '@mui/material/Button';
import './NavBar.css';
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Link from '../Link/Link';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));


export default function NavBar() {
    return (
        <div className="navbar">
            <Link to="/">
                <div className="navbar-logo">
                    <QuestionAnswerIcon style={{ color: "white", fontSize: '30px' }} />
                    <h3>querybox</h3>
                </div>
            </Link>
            <div className="navbar-search">
            </div>
            <div class="navbar-actions">
                <Link to="/login">
                    <Button color="white" variant="outlined">Login</Button>
                </Link>
                <Link to="/register">
                    <Button color="white" variant="outlined">Register</Button>
                </Link>
            </div>
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
