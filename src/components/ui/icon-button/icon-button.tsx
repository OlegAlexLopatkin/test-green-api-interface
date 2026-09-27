import type { FC } from "react";
import classNames from "classnames";

import type { IconButtonProps } from "./icon-button.props";

import "./icon-button.scss";

const IconButton: FC<IconButtonProps> = ({
  className,
  disabled,
  icon,
  type = "button",
  ...rest
}) => {
  const classes = classNames("icon-button", className);

  return (
    <button className={classes} disabled={disabled} type={type} {...rest}>
      {icon}
    </button>
  );
};

export default IconButton;
