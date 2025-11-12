import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const RoleBasedRedirect = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role) {
      // Role-based redirection after login
      switch(user.role) {
        case 'admin':
          navigate('/app/admin/pending-approvals', { replace: true });
          break;
        case 'farmer':
          navigate('/app/farmer/crop-upload', { replace: true });
          break;
        case 'processor':
          navigate('/app/processor/receive-batches', { replace: true });
          break;
        case 'consumer':
          navigate('/app/consumer-portal', { replace: true });
          break;
        case 'regulator':
          navigate('/app/analytics', { replace: true });
          break;
        default:
          navigate('/app/main-dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  return null; // This component doesn't render anything visible
};

RoleBasedRedirect.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string
  })
};

export default RoleBasedRedirect;