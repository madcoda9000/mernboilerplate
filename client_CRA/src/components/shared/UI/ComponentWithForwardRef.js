import {Box} from "@chakra-ui/react";
import React from "react";
/**
 * @description wrapper component with react forward ref. For use with chakraui tooltip.
 * @returns {object} a wrapper component with forward ref
 */
const ComponentWithForwardRef = React.forwardRef(({ children, ...rest }, ref) => (
    <Box ref={ref} {...rest}>
        {children}
    </Box>
));
export default ComponentWithForwardRef;