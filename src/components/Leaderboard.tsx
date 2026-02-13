import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Avatar, Alert,
  Tabs, Tab, Stack
} from '@mui/material';
import { EmojiEvents, SportsSoccer, Handshake, Star, MilitaryTech } from '@mui/icons-material';
import { api } from '../services/api';
import type { PlayerData } from '../services/api';

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32']; // gold, silver, bronze
const MEDAL_EMOJI = ['🥇', '🥈', '🥉'];

const positionColors: Record<string, string> = {
  GK: '#ffeb3b',
  DF: '#4caf50',
  MF: '#2196f3',
  FW: '#f44336',
};

interface RankCardProps {
  player: PlayerData;
  rank: number;
  value: number;
  unit: string;
  color: string;
}

const RankCard: React.FC<RankCardProps> = ({ player, rank, value, unit, color }) => (
  <Card sx={{
    flex: 1,
    minWidth: 160,
    background: rank === 0
      ? 'linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 100%)'
      : rank === 1
        ? 'linear-gradient(135deg, rgba(192,192,192,0.12) 0%, rgba(192,192,192,0.04) 100%)'
        : 'linear-gradient(135deg, rgba(205,127,50,0.10) 0%, rgba(205,127,50,0.03) 100%)',
    border: `1px solid ${MEDAL_COLORS[rank]}40`,
    position: 'relative',
    overflow: 'visible',
  }}>
    <CardContent sx={{ textAlign: 'center', py: 3 }}>
      <Typography fontSize={rank === 0 ? 48 : 36} sx={{ mb: 1 }}>
        {MEDAL_EMOJI[rank]}
      </Typography>
      <Typography variant={rank === 0 ? 'h5' : 'h6'} fontWeight="bold" sx={{ mb: 0.5 }}>
        {player.name}
      </Typography>
      <Chip
        label={player.preferred_position}
        size="small"
        sx={{ bgcolor: positionColors[player.preferred_position], color: '#000', fontWeight: 'bold', mb: 1.5 }}
      />
      <Typography variant={rank === 0 ? 'h3' : 'h4'} fontWeight="900" color={color} sx={{ lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">{unit}</Typography>
    </CardContent>
  </Card>
);

export const Leaderboard: React.FC = () => {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0);

  useEffect(() => {
    api.getLeaderboard()
      .then(setPlayers)
      .catch(() => setError('无法加载数据'));
  }, []);

  const goalRanking = [...players].sort((a, b) => (b.total_goals || 0) - (a.total_goals || 0));
  const assistRanking = [...players].sort((a, b) => (b.total_assists || 0) - (a.total_assists || 0));

  const renderPodium = (
    ranking: PlayerData[],
    getValue: (p: PlayerData) => number,
    unit: string,
    color: string
  ) => {
    const top3 = ranking.slice(0, 3).filter(p => getValue(p) > 0);
    if (top3.length === 0) return null;
    return (
      <Stack direction="row" spacing={2} sx={{ mb: 3 }} justifyContent="center" flexWrap="wrap">
        {top3.map((p, i) => (
          <RankCard key={p.id} player={p} rank={i} value={getValue(p)} unit={unit} color={color} />
        ))}
      </Stack>
    );
  };

  const renderRankTable = (
    ranking: PlayerData[],
    getValue: (p: PlayerData) => number,
    icon: React.ReactNode,
    label: string,
    color: string
  ) => (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell width={60}>排名</TableCell>
            <TableCell>球员</TableCell>
            <TableCell>位置</TableCell>
            <TableCell align="center">{icon} {label}</TableCell>
            <TableCell align="center">场次</TableCell>
            <TableCell align="center">场均</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ranking.map((player, index) => {
            const val = getValue(player);
            const matches = player.matches_played || 0;
            const avg = matches > 0 ? (val / matches).toFixed(2) : '0.00';
            return (
              <TableRow key={player.id} sx={{
                bgcolor: index < 3 && val > 0 ? `${MEDAL_COLORS[index]}10` : 'transparent',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' }
              }}>
                <TableCell>
                  <Typography fontWeight="bold" color={index < 3 && val > 0 ? 'warning.main' : 'inherit'}>
                    {index < 3 && val > 0 ? MEDAL_EMOJI[index] : index + 1}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                      {player.rating}
                    </Avatar>
                    <Typography fontWeight="medium">{player.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={player.preferred_position}
                    size="small"
                    sx={{ bgcolor: positionColors[player.preferred_position], color: '#000', fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography fontWeight="bold" fontSize="1.1rem" color={color}>
                    {val}
                  </Typography>
                </TableCell>
                <TableCell align="center">{matches}</TableCell>
                <TableCell align="center">
                  <Typography color="text.secondary">{avg}</Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        <EmojiEvents sx={{ mr: 1, verticalAlign: 'middle', color: 'warning.main' }} />
        数据统计与荣誉榜
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {players.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <MilitaryTech sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography color="text.secondary">暂无数据，完成比赛并录入数据后显示</Typography>
        </Paper>
      ) : (
        <>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="fullWidth"
              sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
            >
              <Tab icon={<SportsSoccer />} label="射手榜" />
              <Tab icon={<Handshake />} label="助攻榜" />
              <Tab icon={<Star />} label="综合数据" />
            </Tabs>
          </Paper>

          {/* 射手榜 */}
          {tab === 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SportsSoccer color="success" /> 赛季射手榜
              </Typography>
              {renderPodium(goalRanking, p => p.total_goals || 0, '粒进球', 'success.main')}
              {renderRankTable(
                goalRanking,
                p => p.total_goals || 0,
                <SportsSoccer sx={{ fontSize: 16, verticalAlign: 'middle' }} />,
                '进球',
                'success.main'
              )}
            </Box>
          )}

          {/* 助攻榜 */}
          {tab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Handshake color="info" /> 赛季助攻榜
              </Typography>
              {renderPodium(assistRanking, p => p.total_assists || 0, '次助攻', 'info.main')}
              {renderRankTable(
                assistRanking,
                p => p.total_assists || 0,
                <Handshake sx={{ fontSize: 16, verticalAlign: 'middle' }} />,
                '助攻',
                'info.main'
              )}
            </Box>
          )}

          {/* 综合数据 */}
          {tab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star sx={{ color: 'warning.main' }} /> 综合数据总览
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>排名</TableCell>
                      <TableCell>球员</TableCell>
                      <TableCell>位置</TableCell>
                      <TableCell align="center">
                        <SportsSoccer sx={{ fontSize: 18 }} /> 进球
                      </TableCell>
                      <TableCell align="center">
                        <Handshake sx={{ fontSize: 18 }} /> 助攻
                      </TableCell>
                      <TableCell align="center">
                        <Star sx={{ fontSize: 18 }} /> MVP
                      </TableCell>
                      <TableCell align="center">场次</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {players.map((player, index) => (
                      <TableRow key={player.id} sx={{ '&:nth-of-type(odd)': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                        <TableCell>
                          <Typography fontWeight="bold" color={index < 3 ? 'warning.main' : 'inherit'}>
                            {index + 1}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                              {player.rating}
                            </Avatar>
                            <Typography fontWeight="medium">{player.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={player.preferred_position}
                            size="small"
                            sx={{ bgcolor: positionColors[player.preferred_position], color: '#000', fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography fontWeight="bold" color="success.main">
                            {player.total_goals || 0}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography fontWeight="bold" color="info.main">
                            {player.total_assists || 0}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography fontWeight="bold" color="warning.main">
                            {player.mvp_count || 0}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{player.matches_played || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
