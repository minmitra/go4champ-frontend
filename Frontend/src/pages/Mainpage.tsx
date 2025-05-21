
import Navigation from '../components/Navigation';
import { useAuthenti } from '../context/AuthentiContext';

const Mainpage = () => {
    const { logout } = useAuthenti();

    logout();

    return (
    <>
    <Navigation />
    <main>
      <div className="text-center mt-10">
        <h1 className="text-3xl font-bold"></h1>
      </div>
    </main>
      </>

    );
  };
  
  export default Mainpage;
  