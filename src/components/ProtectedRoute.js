import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'next-i18next';

const ProtectedRoute = ({ children }) => {
  const { t } = useTranslation();

  const router = useRouter();
  const { user, loading } = useAuth(); 

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <p>{t('COMMON.LOADING')}</p>; 
  }

  return children;
};

export default ProtectedRoute;
