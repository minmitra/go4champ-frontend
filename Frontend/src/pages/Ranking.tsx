import { useNavigate } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';


const Ranking = () => {
    const navigate = useNavigate();
return (  

<>
<main>


 <div className="navigation-buttons">
    <div>
              <button onClick={() => navigate('/my-friends')} className="navigation-button">
                <FaAngleLeft className="left-icon" />Go to my friends
              </button>
              <button onClick={() => navigate('/challenges')} className="navigation-button right-align">
                Go to challenges <FaAngleRight className="right-icon" />
              </button>
            </div>
    </div>
</main>
</>)


};

export default Ranking;