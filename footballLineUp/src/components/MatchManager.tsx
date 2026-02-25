import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Stack,
  FormControl, InputLabel, Select, MenuItem, Chip, Avatar, List,
  ListItem, ListItemAvatar, ListItemText, IconButton, Divider, Paper, Alert
} from '@mui/material';
import { Add, Person, Delete, Groups } from '@mui/icons-material';
import { api } from '../services/api';
import type { PlayerData } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { canEdit } from '../data/users';

const POSITIONS = ['GK', 'DF', 'MF', 'FW'] as const;
const POSITION_LABELS: Record<string, string> = {
  GK: '门将',
  DF: '后卫',
  MF: '中场',
  FW: '前锋',
};

export const MatchManager: React.FC = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isEditable = currentUser ? canEdit(currentUser.role) : false;

  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [name, setName] = useState('');
  const [position, setPosition] = useState<string>('MF');
  const [rating, setRating] = useState(75);
  const [error, setError] = useState('');

  const loadPlayers = async () => {
    try {
      const data = await api.getPlayers();
      setPlayers(data);
      setError('');
    } catch (e) {
      setError('无法连接服务器');
    }
  };

  useEffect(() => { loadPlayers(); }, []);

  const handleAddPlayer = async () => {
    if (!name.trim()) return;
    try {
      await api.addPlayer({ name: name.trim(), preferred_position: position, rating });
      setName('');
      setRating(75);
      loadPlayers();
    } catch (e) {
      setError('添加失败');
    }
  };

  const handleDeletePlayer = async (id: number) => {
    if (confirm('确定删除这个球员？')) {
      await api.deletePlayer(id);
      loadPlayers();
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        <Groups sx={{ mr: 1, verticalAlign: 'middle' }} />
        球员管理
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!isEditable && (
        <Alert severity="info" sx={{ mb: 2 }}>
          当前为查看模式，仅队长和领队可以编辑
        </Alert>
      )}

      {/* Add Player Card */}
      {isEditable && (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Add sx={{ mr: 1, color: 'success.main' }} />
            添加新球员
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              fullWidth
              label="球员姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
            />
            <FormControl fullWidth size="small">
              <InputLabel>位置</InputLabel>
              <Select
                value={position}
                label="位置"
                onChange={(e) => setPosition(e.target.value)}
              >
                {POSITIONS.map((pos) => (
                  <MenuItem key={pos} value={pos}>
                    {POSITION_LABELS[pos]} ({pos})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="评分"
              type="number"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              size="small"
              inputProps={{ min: 50, max: 99 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleAddPlayer}
              disabled={!name.trim()}
              startIcon={<Add />}
              sx={{ minWidth: 120 }}
            >
              添加
            </Button>
          </Stack>
        </CardContent>
      </Card>
      )}

      {/* Player List */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 1, color: 'secondary.main' }} />
              球员列表
            </Typography>
            <Chip label={`共 ${players.length} 人`} color="primary" />
          </Box>
          
          {players.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.2)' }}>
              <Person sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography color="text.secondary">
                还没有球员，快来添加第一个球员吧！
              </Typography>
            </Paper>
          ) : (
            <List>
              {players.map((player, index) => (
                <Box key={player.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    secondaryAction={
                      isEditable ? (
                        <IconButton edge="end" onClick={() => handleDeletePlayer(player.id)} color="error">
                          <Delete />
                        </IconButton>
                      ) : undefined
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {player.rating}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {player.name}
                          <Chip label={POSITION_LABELS[player.preferred_position]} size="small" />
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          进球: {player.total_goals || 0} | 助攻: {player.total_assists || 0} | MVP: {player.mvp_count || 0}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
