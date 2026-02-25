import { Box, Card, CardContent, Typography, Paper } from '@mui/material';
import { Assessment } from '@mui/icons-material';

export const MatchReport: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Assessment sx={{ mr: 1, color: 'primary.main' }} />
          赛后战报
        </Typography>
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.2)' }}>
          <Typography color="text.secondary">
            暂无比赛数据，请先在「比赛报名」创建比赛
          </Typography>
        </Paper>
      </CardContent>
    </Card>
  );
};
