import { Box } from "@mui/material";
import { styled }  from "@mui/system";

//this is for all the boxes with items that we will have in our pages 

const WidgetWrapper = styled(Box)(({theme}) => ({
    padding: "1.5rem 1.5rem 0.75rem 1.5rem",
    backgroundColor: theme.palette.background.alt,
    borderRadius: "0.75rem"
}));

export default WidgetWrapper;