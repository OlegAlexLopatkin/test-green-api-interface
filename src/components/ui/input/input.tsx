import type { FC } from "react";

import type { InputProps } from "./input.props";

import "./input.scss";

const Input: FC<InputProps> = ({ className = "", onChange, ...props }) => {
  const classes = ["input", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <input
        className="input__input"
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
};

export default Input;
