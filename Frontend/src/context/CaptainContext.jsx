import { createContext , useState, useContext } from "react";

export const CaptainDataContext = createContext();

const CaptainContext  = ({ children }) => {
    const [captainData, setCaptainData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateCaptain = (captainData) =>{
        setCaptainData(captainData);

    };

    const value ={
        captain,
        setCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain
    };

    return(
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
};
export default CaptainContext;