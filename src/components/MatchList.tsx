import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Chip, Stack,
  List, ListItem, ListItemText, IconButton, Paper, Divider, Alert
} from '@mui/material';
import { Add, Event, LocationOn, Groups, Delete, PlayArrow, Check } from '@mui/icons-material';
import { api } from '../services/api';
import type { MatchData } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { canEdit } from '../data/users';

export const MatchList: React.FC = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isEditable = currentUser ? canEdit(currentUser.role) : false;

  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newMatch, setNewMatch] = useState({ match_date: '', match_time: '', location: '', format: '5v5' });
  const loadMatches = async () => {
    try {
      const data = await api.getMatches();
      setMatches(data);
      setError('');
    } catch (e) {
      setError('无法连接服务器，请确保后端已启动');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMatches(); }, []);

  const handleCreate = async () => {
    if (!newMatch.match_date) return;
    await api.createMatch(newMatch);
    setDialogOpen(false);
    setNewMatch({ match_date: '', match_time: '', location: '', format: '5v5' });
    loadMatches();
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定删除这场比赛？')) {
      await api.deleteMatch(id);
      loadMatches();
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    await api.updateMatch(id, { status: status as any });
    loadMatches();
  };

  const statusColors: Record<string, 'default' | 'warning' | 'success'> = {
    upcoming: 'default',
    ongoing: 'warning',
    completed: 'success',
  };
  const statusLabels: Record<string, string> = {
    upcoming: '未开始',
    ongoing: '进行中',
    completed: '已结束',
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          <Event sx={{ mr: 1, verticalAlign: 'middle' }} />
          比赛列表
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}
          sx={{ display: isEditable ? 'inline-flex' : 'none' }}
        >
          创建比赛
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {matches.length === 0 && !loading && !error ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Event sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography color="text.secondary">还没有比赛，点击上方按钮创建一场吧！</Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {matches.map((match) => (
            <Card key={match.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6">
                      {new Date(match.match_date).toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}
                      {match.match_time && ` ${match.match_time.slice(0,5)}`}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip size="small" label={match.format} color="primary" />
                      <Chip size="small" label={statusLabels[match.status]} color={statusColors[match.status]} />
                      <Chip size="small" icon={<Groups />} label={`${match.registered_count || 0} 人报名`} variant="outlined" />
                    </Stack>
                    {match.location && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <LocationOn sx={{ fontSize: 16, verticalAlign: 'middle' }} /> {match.location}
                      </Typography>
                    )}
                    {match.status === 'completed' && (
                      <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
                        比分: {match.home_score} - {match.away_score}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    {isEditable && match.status === 'upcoming' && (
                      <Button size="small" startIcon={<PlayArrow />} onClick={() => handleStatusChange(match.id, 'ongoing')}>
                        开始
                      </Button>
                    )}
                    {isEditable && match.status === 'ongoing' && (
                      <Button size="small" startIcon={<Check />} color="success" onClick={() => handleStatusChange(match.id, 'completed')}>
                        结束
                      </Button>
                    )}
                    {isEditable && (
                    <IconButton color="error" onClick={() => handleDelete(match.id)}>
                      <Delete />
                    </IconButton>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>创建新比赛</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="比赛日期"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newMatch.match_date}
              onChange={(e) => setNewMatch({ ...newMatch, match_date: e.target.value })}
            />
            <TextField
              label="比赛时间"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newMatch.match_time}
              onChange={(e) => setNewMatch({ ...newMatch, match_time: e.target.value })}
            />
            <TextField
              label="比赛地点"
              fullWidth
              value={newMatch.location}
              onChange={(e) => setNewMatch({ ...newMatch, location: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>赛制</InputLabel>
              <Select
                value={newMatch.format}
                label="赛制"
                onChange={(e) => setNewMatch({ ...newMatch, format: e.target.value })}
              >
                <MenuItem value="5v5">5人制</MenuItem>
                <MenuItem value="7v7">7人制</MenuItem>
                <MenuItem value="11v11">11人制</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!newMatch.match_date}>创建</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
