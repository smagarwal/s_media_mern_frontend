import { useEffect, useRef, useState } from "react";
import { 
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery,
    Popover
} from "@mui/material"
import UserImage from "components/UserImage";

import {
    Search,
    Message,
    DarkMode,
    LightMode,
    Notifications,
    Help,
    Menu,
    Close
} from "@mui/icons-material"

import { useDispatch, useSelector} from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const NavBar = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const user = useSelector((state)=> state.user); 
    const token = useSelector((state)=> state.token); 
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)"); //whenever this threshold reached it will interpret it as non mobole screen 
    const theme = useTheme();
    const neutarlLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default; 
    const primaryLight = theme.palette.primary.light; 
    const alt = theme.palette.background.alt; 
    const [filt_input, setFilt_input] = useState(""); 
    const [search_out, setSearch_out] = useState([]);
    const search_bar = useRef(null);
    
    const fullName =`${user.firstName} ${user.lastName}`;
    
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(search_bar.current);
     console.log(search_bar.current);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    useEffect(()=>{

        if(!isNonMobileScreens){
            setAnchorEl(null);
        }

    }, [isNonMobileScreens])
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    
    const handleSearch = async ()=>{
        console.log(filt_input);

        try {
            
            const response = await fetch(

                `${process.env.REACT_APP_BASE_URL}/users/${user._id}/search`,
                {
                    method: "POST",
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({searchText: filt_input})
                }
            );   
            
            const filt_users = await response.json();

            console.log(filt_users);

            setSearch_out(filt_users);

            //display

        }catch(err) {

            console.log(err);

        }

        //display in the dropdown

    }

    return (
        <FlexBetween padding="1rem 6%" backgroundColor={alt}> {/* here due to the box property that we have used we are passing the css components as arguments */}
            <FlexBetween gap="1.75rem">
                {/*some psuedo css properties using*/}
                <Typography 
                fontWeight="bold"
                fontSize="clamp(1rem, 2rem, 2.25rem)"
                color="primary"
                onClick= {() => navigate("/home")}
                sx= { {              
                    "&:hover": {
                        color: primaryLight,
                        cursor: "pointer",
                    },
                }}
                >
                    Mypage

                </Typography>

                {isNonMobileScreens && (
                    <FlexBetween ref={search_bar} backgroundColor={neutarlLight} borderRadius="9p" gap="3rem" padding= "0.1rem 1.5rem">

                        <InputBase 
                            placeholder="Search..." 
                            onChange={(e) => setFilt_input(e.target.value)}
                            value = {filt_input}
                            
                        />

                        <IconButton
                          onClick={(e)=>{handleClick(e); handleSearch()}}
                        >
                            <Search />
                        </IconButton>

                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            anchorReference="anchorEl"
                            // anchorPosition={{ top: 60, left: 210 }}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            onClose={handleClose}
                            >

                                {search_out.length === 0 && (
                                   <div style={{ 
                                    width: '273px', 
                                    }}>
                                        <Typography > No Users </Typography>
                                    </div>
                                )}

                            {search_out.length > 0 && (
                                <div style={{ 
                                    width: '273px', 
                                    }}>
                                {search_out.map((option) => (
                                    <MenuItem key={option._id} onClick={()=> { navigate(`/profile/${option._id}`);
                                    navigate(0);} }>
                                        <FlexBetween gap="1rem">
                                        <UserImage image={option.picturePath} size="30px" />
                                    {option.firstName} {option.lastName} 
                                    </FlexBetween>
                                    </MenuItem>
                                ))}
                                </div>
                            )} 
                           
                            </Popover>

                    </FlexBetween>
                    
                )}
            </FlexBetween> 

            {/* Desktop nav*/}
            {isNonMobileScreens ? (
                <FlexBetween gap="2rem">
                    <IconButton onClick={() => dispatch(setMode())}>
                        {theme.palette.mode === "dark" ? (
                            <DarkMode sx= {{ fontSize: "25px"}} />

                        ): (
                            <LightMode sx= {{ color: dark, fontSize: "25px"}}/>
                        )}
                    </IconButton>

                    <Message sx= {{ fontSize: "25px"}} />
                    <Notifications sx= {{ fontSize: "25px"}} />
                    <Help sx= {{ fontSize: "25px"}} /> 
                    <FormControl variant="standard" value= {fullName}>
                        <Select
                        value={fullName}
                        sx={{
                            backgroundColor: neutarlLight,
                            width: "150px",
                            borderRadius: "0.25rem",
                            p: "0.25rem 1rem",
                            "& .MuiSvgIcon-root" :{
                                pr: "0.25rem",
                                width: "3rem"
                            },
                            "& .MuiSelect-select:focus": {
                                backgroundColor: neutarlLight
                            }
                        }}
                        input = {<InputBase />}
                        >
                            <MenuItem value={fullName}>
                                <Typography> {fullName}</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => dispatch(setLogout())} > Log Out</MenuItem>
                        </Select>
                    </FormControl>

                </FlexBetween>
            ):(
                <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                >
                    <Menu/>
                </IconButton>
            )}

            {/* Mobile Nav */}

            {!isNonMobileScreens && isMobileMenuToggled && (
                <Box
                    position="fixed"
                    right="0"
                    bottom="0"
                    height="100%"
                    zIndex="10"
                    maxWidth="500px"
                    minWidth="300px"
                    backgroundColor={background}
                >
                    {/*Close Icon */}
                    <Box display="flex" justifyContent="flex-end" p="1rem">
                        <IconButton
                         onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                         >
                            <Close />
                         </IconButton>

                    </Box>

                    {/* Menu Item */}
                    <FlexBetween 
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    gap="3rem"
                    >
                    <IconButton
                     onClick={() => dispatch(setMode())}
                     sx={{ fontSize:"25px"}}
                     >
                        {theme.palette.mode === "dark" ? (
                            <DarkMode sx= {{ fontSize: "25px"}} />

                        ): (
                            <LightMode sx= {{ color: dark, fontSize: "25px"}}/>
                        )}
                    </IconButton>

                    <Message sx= {{ fontSize: "25px"}} />
                    <Notifications sx= {{ fontSize: "25px"}} />
                    <Help sx= {{ fontSize: "25px"}} />
                    <FormControl variant="standard" value= {fullName}>
                        <Select
                        value={fullName}
                        sx={{
                            backgroundColor: neutarlLight,
                            width: "150px",
                            borderRadius: "0.25rem",
                            p: "0.25rem 1 rem",
                            "& .MuiSvgIcon-root" :{
                                pr: "0.25rem",
                                width: "3rem"
                            },
                            "& .MuiSelect-select:focus": {
                                backgroundColor: neutarlLight
                            }
                        }}
                        input = {<InputBase />}
                        >
                            <MenuItem value={fullName}>
                                <Typography> {fullName}</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => dispatch(setLogout())} > Log Out</MenuItem>
                        </Select>
                    </FormControl>
                    </FlexBetween>
                </Box>
            )}
        </FlexBetween>
    )
}

export default NavBar;