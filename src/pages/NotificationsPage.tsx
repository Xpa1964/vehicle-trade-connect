import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const navigate = useNavigate();

  // Redirect to messages page since notifications are now integrated there
  useEffect(() => {
    navigate('/messages', { replace: true });
  }, [navigate]);

  return null;
};

export default NotificationsPage;