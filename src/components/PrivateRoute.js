import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Redirect dem til login siden hvis de ikke er authenticated
        return <Navigate to="/login" />;
    }

    // Hvis de er authenticated, vis den beskyttede route
    return children;
};

export default PrivateRoute; 