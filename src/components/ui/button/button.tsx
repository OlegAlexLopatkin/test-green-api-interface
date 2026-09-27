import type { FC } from "react";
import type { ButtonProps } from "./button.props";

import "./button.scss";

const Button: FC<ButtonProps> = ({
  className,
  disabled,
  label,
  type = "button",
  ...rest
}) => {
  const classes = ["button", className].filter(Boolean).join(" ");

  return (
    <button className={classes} disabled={disabled} type={type} {...rest}>
      {label}
    </button>
  );
};

export default Button;
