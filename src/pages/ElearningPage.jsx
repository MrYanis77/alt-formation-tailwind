import { Navigate } from 'react-router-dom';

export default function ElearningPage() {
  return <Navigate to="/formations?type=elearning" replace />;
}
