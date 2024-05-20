import { BeatLoader } from "react-spinners";

interface ButtonProps {
  disabled: boolean;
  message: string;
  buttonClass: string;
}

const Button = ({ disabled = false, message, buttonClass }: ButtonProps) => {
  return disabled ? (
    <button className={buttonClass} type="submit" disabled>
      <BeatLoader size={8} color={"#FFFFFF"} />
    </button>
  ) : (
    <button type="submit" className={buttonClass}>
      {message}
    </button>
  );
};

export default Button;
