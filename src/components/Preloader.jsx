
import { CircularProgress, Box } from '@mui/material';

const Preloader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Preloader;
