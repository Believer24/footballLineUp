import { AppBar, Toolbar, Typography, Avatar } from '@mui/material';
import { Sports } from '@mui/icons-material';

export const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper' }}>
      <Toolbar>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
          <Sports />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          ⚽ 金龙球员花名册
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
