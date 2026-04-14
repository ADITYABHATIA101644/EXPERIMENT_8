import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roleRequired }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        return <Navigate to="/" />;
    }

    if (roleRequired && user.role !== roleRequired) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;