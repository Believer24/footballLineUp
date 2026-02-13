import { useState, useCallback } from 'react';
import { DndContext, DragOverlay, pointerWithin, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  Box, Card, CardContent, Typography, ToggleButtonGroup, ToggleButton,
  FormControl, Select, MenuItem, Divider, Chip, Stack, Alert, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Avatar, Snackbar
} from '@mui/material';
import {
  SportsSoccer, Groups, Event, LocationOn, AutoAwesome, Save,
  EmojiEvents, Assessment, SwapHoriz
} from '@mui/icons-material';
import type { GameFormat, Player } from '../types';
import { useGameStore } from '../store/gameStore';
import { FORMATIONS } from '../data/formations';
import { Pitch } from './Pitch';
import { Bench } from './Bench';
import { PlayerCard } from './PlayerCard';
import { QuickImport } from './QuickImport';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { canEdit } from '../data/users';

interface PlayerMatchStats {
  playerId: string;
  playerName: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  rating: number;
  isMVP: boolean;
}

export const TacticsBoard: React.FC = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isEditable = currentUser ? canEdit(currentUser.role) : false;

  const {
    gameFormat,
    selectedFormation, setSelectedFormation,
    bench, lineup, setBench, setLineup,
    movePlayerToLineup, movePlayerToBench, swapLineupPositions,
    matchInfo, setMatchInfo,
    matchGenerated, generatedMatchId, setMatchGenerated,
    matchRatings, setMatchRatings,
    switchFormat, autoArrangeLineup
  } = useGameStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: isEditable ? 5 : Infinity } })
  );
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [playerStats, setPlayerStats] = useState<PlayerMatchStats[]>([]);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [snackMsg, setSnackMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const formations = FORMATIONS[gameFormat];
  const formationOptions = Object.keys(formations);
  const allPlayers = [...lineup.filter(Boolean) as Player[], ...bench];
  const lineupCount = lineup.filter(Boolean).length;
  const lineupSize = lineup.length;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const player = [...bench, ...lineup.filter(Boolean)].find(
      p => p && p.id === active.id
    ) as Player | undefined;
    if (player) setActivePlayer(player);
  }, [bench, lineup]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActivePlayer(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isFromBench = bench.some(p => p.id === activeId);
    const sourceLineupIndex = lineup.findIndex(p => p?.id === activeId);
    const isFromLineup = sourceLineupIndex !== -1;

    const isToLineup = overId.startsWith('position-');
    const targetIndex = isToLineup ? parseInt(overId.replace('position-', '')) : -1;

    if (isFromBench && isToLineup) {
      movePlayerToLineup(activeId, targetIndex);
    } else if (isFromLineup && overId === 'bench') {
      movePlayerToBench(activeId);
    } else if (isFromLineup && isToLineup) {
      swapLineupPositions(sourceLineupIndex, targetIndex);
    }
  }, [bench, lineup, movePlayerToLineup, movePlayerToBench, swapLineupPositions]);

  const handleImport = (data: { matchDate: string; matchTime: string; location: string; players: any[] }, format: string) => {
    setMatchInfo({ date: data.matchDate, time: data.matchTime, location: data.location });

    // Use switchFormat-compatible approach
    const targetFormat = format as GameFormat;
    const gameStore = useGameStore.getState();

    const newPlayers: Player[] = data.players.map((p, i) => ({
      id: `imported-${i}-${Date.now()}`,
      name: p.name,
      position: p.position,
      preferredPosition: p.position,
      rating: 75 + Math.floor(Math.random() * 15),
      rarity: Math.random() > 0.5 ? 'gold' : 'silver',
      avatar: p.avatar,
      jerseyNumber: p.jerseyNumber || i + 1,
      stats: {
        pace: 70 + Math.floor(Math.random() * 20),
        shooting: 70 + Math.floor(Math.random() * 20),
        passing: 70 + Math.floor(Math.random() * 20),
        dribbling: 70 + Math.floor(Math.random() * 20),
        defense: 70 + Math.floor(Math.random() * 20),
        physical: 70 + Math.floor(Math.random() * 20),
      },
    }));

    const lineupSize = targetFormat === '5v5' ? 5 : targetFormat === '7v7' ? 7 : 11;
    const newLineup: (Player | null)[] = Array(lineupSize).fill(null);
    const newBench: Player[] = [];

    newPlayers.forEach((player, i) => {
      if (i < lineupSize) {
        newLineup[i] = player;
      } else {
        newBench.push(player);
      }
    });

    // Set format first, then lineup
    const formations = FORMATIONS[targetFormat];
    const firstFormation = Object.keys(formations)[0];
    useGameStore.setState({
      gameFormat: targetFormat,
      selectedFormation: firstFormation,
      lineup: newLineup,
      bench: newBench,
      matchGenerated: false,
      generatedMatchId: null,
    });
  };

  const handleFormatSwitch = (_: any, newFormat: GameFormat | null) => {
    if (newFormat) {
      switchFormat(newFormat);
    }
  };

  const handleGenerateMatch = async () => {
    if (!matchInfo) return;
    setSaving(true);
    try {
      const result = await api.createMatch({
        match_date: matchInfo.date || new Date().toISOString().split('T')[0],
        match_time: matchInfo.time || undefined,
        location: matchInfo.location || undefined,
        format: gameFormat,
      });

      // Bulk import all players to DB and register to match
      const playersToImport = allPlayers.map(p => ({
        name: p.name,
        preferred_position: p.preferredPosition || 'MF',
        rating: p.rating || 75,
      }));
      if (playersToImport.length > 0) {
        await api.importPlayers(result.id, playersToImport);
      }

      setMatchGenerated(true, result.id);
      setSnackMsg('✅ 比赛已生成！球员已注册，可在比赛列表中查看');
    } catch (e) {
      setSnackMsg('❌ 生成失败，请检查服务器连接');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenStats = () => {
    const players = lineup.filter(Boolean) as Player[];
    setPlayerStats(players.map(p => ({
      playerId: p.id,
      playerName: p.name,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      rating: 6,
      isMVP: false,
    })));
    setHomeScore(0);
    setAwayScore(0);
    setStatsDialogOpen(true);
  };

  // Professional rating algorithm
  const calcRating = (s: { goals: number; assists: number; yellowCards: number; redCards: number }): number => {
    const allZero = s.goals === 0 && s.assists === 0 && s.yellowCards === 0 && s.redCards === 0;
    if (allZero) return 6.0;
    const raw = 6.0 + s.goals * 1.0 + s.assists * 0.5 - s.yellowCards * 0.5 - s.redCards * 1.5;
    return Math.round(Math.min(10, Math.max(1, raw)) * 10) / 10; // clamp [1,10], 1 decimal
  };

  const updatePlayerStat = (index: number, field: keyof PlayerMatchStats, value: any) => {
    setPlayerStats(prev => {
      const updated = prev.map(s => ({ ...s }));
      (updated[index] as any)[field] = value;

      // Recalculate all ratings
      updated.forEach(s => {
        s.rating = calcRating(s);
      });

      // Auto-assign MVP to highest rating player(s) with at least one non-zero stat
      const maxRating = Math.max(...updated.map(s => s.rating));
      updated.forEach(s => {
        const hasStats = s.goals > 0 || s.assists > 0 || s.yellowCards > 0 || s.redCards > 0;
        s.isMVP = hasStats && s.rating === maxRating;
      });

      return updated;
    });
  };

  const handleSaveStats = async () => {
    if (!generatedMatchId) {
      setSnackMsg('❌ 请先生成比赛');
      return;
    }
    setSaving(true);
    try {
      // Use batch endpoint to save all stats at once (resolves by player name)
      await api.batchSaveStats(generatedMatchId, {
        stats: playerStats,
        home_score: homeScore,
        away_score: awayScore,
        formation: selectedFormation,
      });

      // Store match ratings for card display
      const ratingsMap: Record<string, number> = {};
      playerStats.forEach(s => { ratingsMap[s.playerName] = s.rating; });
      setMatchRatings(ratingsMap);

      setStatsDialogOpen(false);
      setSnackMsg('✅ 赛后数据已保存！查看"数据统计"了解详情');
    } catch (e) {
      setSnackMsg('❌ 保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      <Box>
        {/* Read-only Alert */}
        {!isEditable && (
          <Alert severity="info" sx={{ mb: 2 }}>
            当前为查看模式，仅队长和领队可以编辑
          </Alert>
        )}

        {/* Match Info Banner */}
        {matchInfo && (matchInfo.date || matchInfo.location) && (
          <Alert severity="info" sx={{ mb: 2 }}
            action={
              isEditable && (
              <Stack direction="row" spacing={1}>
                {!matchGenerated && (
                  <Button
                    size="small" variant="contained" color="success"
                    startIcon={<AutoAwesome />}
                    onClick={handleGenerateMatch}
                    disabled={saving || allPlayers.length === 0}
                  >
                    一键生成比赛
                  </Button>
                )}
                {matchGenerated && (
                  <Button
                    size="small" variant="contained" color="warning"
                    startIcon={<Assessment />}
                    onClick={handleOpenStats}
                    disabled={lineupCount === 0}
                  >
                    赛后统计
                  </Button>
                )}
              </Stack>
              )
            }
          >
            <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
              {matchInfo.date && <Chip icon={<Event />} label={`日期: ${matchInfo.date}`} size="small" />}
              {matchInfo.time && <Chip icon={<Event />} label={`时间: ${matchInfo.time}`} size="small" />}
              {matchInfo.location && <Chip icon={<LocationOn />} label={matchInfo.location} size="small" />}
              {matchGenerated && <Chip icon={<EmojiEvents />} label="比赛已生成" color="success" size="small" />}
            </Stack>
          </Alert>
        )}

        {/* Controls */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  赛制选择
                  <Typography component="span" variant="caption" color="info.main" sx={{ ml: 1 }}>
                    <SwapHoriz sx={{ fontSize: 14, verticalAlign: 'middle' }} /> 切换保留球员
                  </Typography>
                </Typography>
                <ToggleButtonGroup
                  value={gameFormat}
                  exclusive
                  onChange={handleFormatSwitch}
                  fullWidth
                  size="small"
                  disabled={!isEditable}
                >
                  <ToggleButton value="5v5"><Groups sx={{ mr: 1 }} /> 5人制</ToggleButton>
                  <ToggleButton value="7v7"><Groups sx={{ mr: 1 }} /> 7人制</ToggleButton>
                  <ToggleButton value="11v11"><Groups sx={{ mr: 1 }} /> 11人制</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>阵型选择</Typography>
                <FormControl fullWidth size="small" disabled={!isEditable}>
                  <Select value={selectedFormation} onChange={(e) => setSelectedFormation(e.target.value)}>
                    {formationOptions.map((f) => (<MenuItem key={f} value={f}>{f}</MenuItem>))}
                  </Select>
                </FormControl>
              </Box>

              {isEditable && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>快速操作</Typography>
                <Stack direction="row" spacing={1}>
                  <QuickImport onImport={handleImport} currentFormat={gameFormat} />
                  {bench.length > 0 && lineup.some(p => !p) && (
                    <Button
                      variant="outlined" color="info" size="small"
                      onClick={autoArrangeLineup}
                      startIcon={<AutoAwesome />}
                    >
                      自动排列
                    </Button>
                  )}
                </Stack>
              </Box>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Pitch */}
        <Card sx={{ mb: 3, overflow: 'visible' }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SportsSoccer sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6">战术板</Typography>
              <Chip label={selectedFormation} size="small" color="primary" sx={{ ml: 2 }} />
              <Chip label={`${lineupCount}/${lineupSize} 人上场`} size="small"
                color={lineupCount >= lineupSize ? 'success' : 'default'} sx={{ ml: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                💡 拖拽球员交换位置 · 点击卡片翻转查看号码
              </Typography>
            </Box>
            <Pitch />
          </CardContent>
        </Card>

        {/* Bench */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Groups sx={{ mr: 1, color: 'secondary.main' }} />
              替补席
              <Chip label={`${bench.length} 人`} size="small" color="secondary" sx={{ ml: 2 }} />
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Bench />
          </CardContent>
        </Card>
      </Box>

      <DragOverlay>
        {activePlayer && <PlayerCard player={activePlayer} isDragging />}
      </DragOverlay>

      {/* Post-Match Stats Dialog */}
      <Dialog open={statsDialogOpen} onClose={() => setStatsDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assessment sx={{ color: 'warning.main' }} />
          赛后数据统计
        </DialogTitle>
        <DialogContent>
          {/* Score */}
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'rgba(0,0,0,0.2)' }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">比赛比分</Typography>
            <Stack direction="row" spacing={3} alignItems="center" justifyContent="center">
              <Box textAlign="center">
                <Typography variant="caption" color="text.secondary">主队</Typography>
                <TextField
                  type="number"
                  value={homeScore}
                  onChange={(e) => setHomeScore(Math.max(0, Number(e.target.value)))}
                  size="small"
                  sx={{ width: 80 }}
                  inputProps={{ min: 0, style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' } }}
                />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="text.secondary">:</Typography>
              <Box textAlign="center">
                <Typography variant="caption" color="text.secondary">客队</Typography>
                <TextField
                  type="number"
                  value={awayScore}
                  onChange={(e) => setAwayScore(Math.max(0, Number(e.target.value)))}
                  size="small"
                  sx={{ width: 80 }}
                  inputProps={{ min: 0, style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' } }}
                />
              </Box>
            </Stack>
          </Paper>

          {/* Player Stats Table */}
          <Paper sx={{ overflow: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>球员</TableCell>
                  <TableCell align="center">⚽ 进球</TableCell>
                  <TableCell align="center">🅰️ 助攻</TableCell>
                  <TableCell align="center">🟨 黄牌</TableCell>
                  <TableCell align="center">🟥 红牌</TableCell>
                  <TableCell align="center">评分(自动)</TableCell>
                  <TableCell align="center">⭐ MVP(自动)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {playerStats.map((stat, idx) => (
                  <TableRow key={stat.playerId} sx={{
                    bgcolor: stat.isMVP ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' }
                  }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: 12 }}>
                          {idx + 1}
                        </Avatar>
                        <Typography fontWeight="bold" fontSize="0.9rem">{stat.playerName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number" size="small" sx={{ width: 65 }}
                        value={stat.goals}
                        onChange={(e) => updatePlayerStat(idx, 'goals', Math.max(0, Number(e.target.value)))}
                        inputProps={{ min: 0, style: { textAlign: 'center' } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number" size="small" sx={{ width: 65 }}
                        value={stat.assists}
                        onChange={(e) => updatePlayerStat(idx, 'assists', Math.max(0, Number(e.target.value)))}
                        inputProps={{ min: 0, style: { textAlign: 'center' } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number" size="small" sx={{ width: 65 }}
                        value={stat.yellowCards}
                        onChange={(e) => updatePlayerStat(idx, 'yellowCards', Math.max(0, Number(e.target.value)))}
                        inputProps={{ min: 0, style: { textAlign: 'center' } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number" size="small" sx={{ width: 65 }}
                        value={stat.redCards}
                        onChange={(e) => updatePlayerStat(idx, 'redCards', Math.max(0, Number(e.target.value)))}
                        inputProps={{ min: 0, style: { textAlign: 'center' } }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ minWidth: 80 }}>
                      <Chip
                        label={stat.rating}
                        size="small"
                        sx={{
                          fontWeight: 900,
                          fontSize: '0.85rem',
                          bgcolor: stat.rating >= 8 ? 'rgba(76,175,80,0.2)' : stat.rating >= 6 ? 'rgba(33,150,243,0.2)' : 'rgba(244,67,54,0.2)',
                          color: stat.rating >= 8 ? '#4caf50' : stat.rating >= 6 ? '#2196f3' : '#f44336',
                          border: `1px solid ${stat.rating >= 8 ? '#4caf50' : stat.rating >= 6 ? '#2196f3' : '#f44336'}`,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          fontSize: '1.2rem',
                          opacity: stat.isMVP ? 1 : 0.2,
                          transition: 'all 0.3s',
                          filter: stat.isMVP ? 'drop-shadow(0 0 6px gold)' : 'none',
                        }}
                      >
                        {stat.isMVP ? '⭐' : '☆'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatsDialogOpen(false)}>取消</Button>
          <Button
            variant="contained" color="primary"
            startIcon={<Save />}
            onClick={handleSaveStats}
            disabled={saving}
          >
            {saving ? '保存中...' : '保存赛后数据'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={!!snackMsg}
        autoHideDuration={3000}
        onClose={() => setSnackMsg('')}
        message={snackMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </DndContext>
  );
};
