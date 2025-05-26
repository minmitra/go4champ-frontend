import { useAuthenti } from '../context/AuthentiContext';

const Mainpage = () => {
    const { isAuthenticated } = useAuthenti();


    return (
    <>
    <main>
      <div className="text-center mt-10">
        <h1 className="text-3xl font-bold">
          {isAuthenticated ? "Welcome back!" : "Not logged in"}
        </h1>
      </div>
    </main>
      </>

    );
  };
  
  export default Mainpage;
  