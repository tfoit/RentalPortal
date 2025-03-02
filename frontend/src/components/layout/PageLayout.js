import React from "react";
import { Box, Container, Typography, Divider, CircularProgress, Alert, Paper } from "@mui/material";
import { combineStyles } from "../../utils/styleUtils";

/**
 * Enhanced PageLayout component for consistent page structure
 * Follows the consistent styling approach between Material UI and Tailwind
 * Uses natural earthy color palette
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} [props.title] - Page title
 * @param {string} [props.subtitle] - Optional subtitle
 * @param {React.ReactNode} [props.actions] - Actions to display in the header
 * @param {boolean} [props.loading] - Whether the page is in loading state
 * @param {string} [props.error] - Error message to display
 * @param {boolean} [props.fullWidth=false] - Whether the content should take full width
 * @param {string} [props.className] - Additional CSS classes for the content container
 * @param {Object} [props.contentProps] - Additional props for the content container
 * @param {string} [props.variant="default"] - Layout variant ("default", "narrow", "centered")
 * @param {boolean} [props.withPaper=false] - Whether to wrap content in a Paper component
 * @param {string} [props.bgColor] - Background color class (uses Tailwind)
 */
const PageLayout = ({ children, title, subtitle, actions, loading = false, error = null, fullWidth = false, className = "", contentProps = {}, variant = "default", withPaper = false, bgColor = "bg-[#F5F2E9] dark:bg-gray-800", ...rest }) => {
  // Determine max width based on variant
  const getMaxWidth = () => {
    switch (variant) {
      case "narrow":
        return "sm";
      case "centered":
        return "md";
      case "default":
      default:
        return fullWidth ? false : "lg";
    }
  };

  // Determine content alignment based on variant
  const getContentAlignment = () => {
    return variant === "centered" ? "center" : "left";
  };

  // Combine styles for Box component
  const boxStyles = combineStyles(`min-h-screen pb-12 ${bgColor}`, {});

  // Combine styles for Container component
  const containerStyles = combineStyles("px-4 py-8", {});

  // Combine styles for content Box
  const contentStyles = combineStyles(`text-${getContentAlignment()} ${className}`, {});

  // Combine styles for Paper wrapper (if used)
  const paperStyles = combineStyles("p-6 rounded-xl shadow-soft", {});

  // Render loading state
  if (loading) {
    return (
      <Box className={boxStyles.className} sx={boxStyles.sx}>
        <Container maxWidth={getMaxWidth()} className={containerStyles.className} sx={containerStyles.sx}>
          {title && (
            <Typography variant="h4" component="h1" className="font-bold mb-4 text-[#3A5145]">
              {title}
            </Typography>
          )}
          <Box className="flex justify-center items-center py-12">
            <CircularProgress color="primary" />
          </Box>
        </Container>
      </Box>
    );
  }

  // Prepare content
  const content = (
    <>
      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}

      <Box className={contentStyles.className} sx={contentStyles.sx} {...contentProps} {...rest}>
        {children}
      </Box>
    </>
  );

  return (
    <Box className={boxStyles.className} sx={boxStyles.sx}>
      <Container maxWidth={getMaxWidth()} className={containerStyles.className} sx={containerStyles.sx}>
        {(title || actions) && (
          <>
            <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              {title && (
                <Box>
                  <Typography variant="h4" component="h1" className="text-[#3A5145] dark:text-darkText font-bold">
                    {title}
                  </Typography>
                  {subtitle && (
                    <Typography variant="subtitle1" className="text-[#4D6A59] dark:text-darkText-secondary mt-1">
                      {subtitle}
                    </Typography>
                  )}
                </Box>
              )}
              {actions && <Box className="mt-4 sm:mt-0">{actions}</Box>}
            </Box>
            <Divider className="mb-6" />
          </>
        )}

        {withPaper ? (
          <Paper className={paperStyles.className} sx={paperStyles.sx} elevation={0}>
            {content}
          </Paper>
        ) : (
          content
        )}
      </Container>
    </Box>
  );
};

export default PageLayout;
