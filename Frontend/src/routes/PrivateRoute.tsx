import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthenti } from "../context/AuthentiContext";

type PrivateRouteProps = {
    children: ReactNode;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({children}) => {
    const {isAuthenticated} = useAuthenti();

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;