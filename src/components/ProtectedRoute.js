import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { user, loading } = useAuth(); 

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <p>Loading...</p>; 
  }

  return children;
};

export default ProtectedRoute;
