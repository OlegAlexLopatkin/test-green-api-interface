import type { FC } from "react";
import type { IconButtonProps } from "./icon-button.props";

import "./icon-button.scss";

const IconButton: FC<IconButtonProps> = ({
  className,
  disabled,
  icon,
  type = "button",
  ...rest
}) => {
  const classes = ["icon-button", className].filter(Boolean).join(" ");

  return (
    <button className={classes} disabled={disabled} type={type} {...rest}>
      {icon}
    </button>
  );
};

export default IconButton;
