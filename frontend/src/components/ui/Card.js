import React from "react";
import { Card as MuiCard, CardContent, CardHeader, CardActions, CardMedia } from "@mui/material";
import { shadowStyles } from "../../utils/styleUtils";

/**
 * Enhanced Card component that integrates Material UI with Tailwind CSS styling
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.variant - Card variant (primary, secondary, etc.)
 * @param {React.ReactNode} props.header - Card header content
 * @param {React.ReactNode} props.title - Card title (alternative to header)
 * @param {React.ReactNode} props.subheader - Card subheader
 * @param {React.ReactNode} props.action - Card header action
 * @param {React.ReactNode} props.footer - Card footer content
 * @param {string} props.imageUrl - URL for card image
 * @param {string} props.imageAlt - Alt text for card image
 * @param {number} props.imageHeight - Height for card image
 * @param {string} props.shadow - Shadow size (none, sm, md, lg, xl, soft)
 * @param {boolean} props.hover - Whether card should have hover effects
 * @param {string} props.className - Additional Tailwind classes
 * @param {Object} props.sx - Additional Material UI styles
 * @returns {JSX.Element}
 */
const Card = ({ children, variant, header, title, subheader, action, footer, imageUrl, imageAlt = "", imageHeight = 200, shadow = "soft", hover = false, className = "", sx = {}, ...rest }) => {
  // Determine shadow classes based on shadow prop
  const shadowClass = shadowStyles[shadow]?.tailwind || shadowStyles.soft.tailwind;

  // Determine variant classes
  const variantClass = variant ? `border-l-4 border-${variant}` : "";

  // Hover effects
  const hoverClass = hover ? "transition-transform duration-300 hover:scale-[1.02]" : "";

  // Combined classes
  const combinedClasses = `${shadowClass} ${variantClass} ${hoverClass} ${className}`;

  // Combined sx styles
  const combinedSx = {
    borderRadius: 2,
    overflow: "hidden",
    ...sx,
  };

  return (
    <MuiCard className={combinedClasses} sx={combinedSx} {...rest}>
      {/* Card Header - either custom header or title/subheader */}
      {(header || title || subheader) && (header ? <div className="px-4 pt-4">{header}</div> : <CardHeader title={title} subheader={subheader} action={action} />)}

      {/* Card Image */}
      {imageUrl && <CardMedia component="img" height={imageHeight} image={imageUrl} alt={imageAlt} className="w-full object-cover" />}

      {/* Card Content */}
      <CardContent>{children}</CardContent>

      {/* Card Footer */}
      {footer && <CardActions>{footer}</CardActions>}
    </MuiCard>
  );
};

export default Card;
