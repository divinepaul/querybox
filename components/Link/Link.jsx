import { useNavigate } from "react-router-dom";
import './Link.css';

export default function Link(props) {
  const navigate = useNavigate();
  function handleClick() {
    navigate(props.to);
  }
  return (
      <div className="link-container" onClick={handleClick}>
          {props.children}
      </div>

  );
}
