import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Box, Tabs, Tab, AppBar, Toolbar, Typography, Avatar, Chip, Button } from '@mui/material';
import { Sports, Groups, EmojiEvents, Assessment, Event, Logout } from '@mui/icons-material';
import { useState } from 'react';
import { theme } from './theme';
import teamIcon from './assets/teamIcon/teamIcon.jpg';
import { TacticsBoard } from './components/TacticsBoard';
import { MatchManager } from './components/MatchManager';
import { MatchList } from './components/MatchList';
import { Leaderboard } from './components/Leaderboard';
import { Login } from './components/Login';
import { useAuthStore } from './store/authStore';
import { ROLE_LABELS } from './data/users';
import './index.css';

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const { isLoggedIn, currentUser, logout } = useAuthStore();

  const handleSelectMatch = (id: number) => {
    setSelectedMatchId(id);
    setCurrentTab(2); // Switch to Tactics Board
  };

  if (!isLoggedIn || !currentUser) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" sx={{ bgcolor: 'background.paper', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Toolbar>
            <Avatar src={teamIcon} sx={{ mr: 2, width: 40, height: 40 }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
              ⚽ 金龙球员花名册
            </Typography>
            <Chip
              label={`${currentUser.displayName} (${ROLE_LABELS[currentUser.role]})`}
              color="primary"
              size="small"
              sx={{ mr: 1 }}
            />
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<Logout />}
              onClick={logout}
              sx={{ textTransform: 'none' }}
            >
              退出
            </Button>
          </Toolbar>
          <Tabs
            value={currentTab}
            onChange={(_, v) => setCurrentTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ bgcolor: 'rgba(0,0,0,0.2)' }}
          >
            <Tab icon={<Event />} label="比赛列表" />
            <Tab icon={<Groups />} label="球员管理" />
            <Tab icon={<Sports />} label="战术板" />
            <Tab icon={<EmojiEvents />} label="数据统计" />
          </Tabs>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 3 }}>
          {currentTab === 0 && <MatchList onSelectMatch={handleSelectMatch} />}
          {currentTab === 1 && <MatchManager />}
          {currentTab === 2 && <TacticsBoard matchId={selectedMatchId} />}
          {currentTab === 3 && <Leaderboard />}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
