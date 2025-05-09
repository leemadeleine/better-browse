import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

interface SustainabilityTipProps {
  title?: string;
  message: string;
  onClose: () => void;
  learnMoreLink?: string;
  icon?: React.ReactNode;
}

const SustainabilityTip: React.FC<SustainabilityTipProps> = ({
  title = 'Sustainability Tip',
  message,
  onClose,
  learnMoreLink,
  icon = <LightbulbIcon sx={{ color: '#4B985A' }} />,
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: '#f2f9f3',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        border: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <IconButton
        sx={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          padding: '4px',
        }}
        onClick={onClose}
        size="small"
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <Box display="flex" alignItems="center" mb={1}>
        <Box mr={2} display="flex" alignItems="center">
          {icon}
        </Box>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: '#4B985A' }}
        >
          {title}
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ mb: learnMoreLink ? 1 : 0 }}>
        {message}
      </Typography>

      {learnMoreLink && (
        <Box sx={{ alignSelf: 'flex-end', mt: 1 }}>
          <Typography
            variant="body2"
            component="a"
            href={learnMoreLink}
            target="_blank"
            sx={{
              color: '#4B985A',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Learn More
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SustainabilityTip; 