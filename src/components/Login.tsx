import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Alert, Avatar, Stack
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import teamIcon from '../assets/teamIcon/teamIcon.jpg';
import { useAuthStore } from '../store/authStore';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码');
      return;
    }
    const success = login(username.trim(), password);
    if (!success) {
      setError('用户名或密码错误');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Avatar
            src={teamIcon}
            sx={{ width: 80, height: 80, mx: 'auto', mb: 2, border: '3px solid', borderColor: 'primary.main' }}
          />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            ⚽ 金龙FC足球俱乐部
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            请登录以继续
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Stack spacing={2}>
            <TextField
              fullWidth
              label="用户名"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              size="small"
            />
            <TextField
              fullWidth
              label="密码"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              size="small"
            />
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              sx={{ mt: 1 }}
            >
              登录
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
            默认账号：captain / manager / player1 / player2，密码：123456
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
