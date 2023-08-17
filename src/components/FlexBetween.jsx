import { Box } from "@mui/material";
import { styled }  from "@mui/system";

//this way we can reuse these css components without typing it again and again 

const FlexBetween = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
});

export default FlexBetween;