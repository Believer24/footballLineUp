import { useState } from 'react';
import {
  Box, Typography, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip, Stack, Alert, Paper, Avatar, FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material';
import { ContentPaste, AutoAwesome, Groups, Event, LocationOn } from '@mui/icons-material';

// 本地图片库 - 按位置分类
import GK01 from '../assets/playerIcon/GK01.png';
import GK02 from '../assets/playerIcon/GK02.png';
import CB01 from '../assets/playerIcon/CB01.png';
import CB02 from '../assets/playerIcon/CB02.png';
import CB03 from '../assets/playerIcon/CB03.png';
import LB01 from '../assets/playerIcon/LB01.png';
import LB02 from '../assets/playerIcon/LB02.png';
import RB01 from '../assets/playerIcon/RB01.png';
import RB02 from '../assets/playerIcon/RB02.png';
import CDM01 from '../assets/playerIcon/CDM01.png';
import CDM02 from '../assets/playerIcon/CDM02.png';
import CM01 from '../assets/playerIcon/CM01.png';
import CM02 from '../assets/playerIcon/CM02.png';
import CAM01 from '../assets/playerIcon/CAM01.png';
import LM01 from '../assets/playerIcon/LM01.png';
import RM01 from '../assets/playerIcon/RM01.png';
import LW02 from '../assets/playerIcon/LW02.png';
import ST01 from '../assets/playerIcon/ST01.png';
import ST02 from '../assets/playerIcon/ST02.png';
import ST03 from '../assets/playerIcon/ST03.png';
import ST04 from '../assets/playerIcon/ST04.png';
import ST05 from '../assets/playerIcon/ST05.png';
import ST06 from '../assets/playerIcon/ST06.png';

const POSITION_AVATARS: Record<string, string[]> = {
  GK: [GK01, GK02],
  DF: [CB01, CB02, CB03, LB01, LB02, RB01, RB02],
  MF: [CDM01, CDM02, CM01, CM02, CAM01, LM01, RM01, LW02],
  FW: [ST01, ST02, ST03, ST04, ST05, ST06],
};

interface ParsedData {
  matchDate: string;
  matchTime: string;
  location: string;
  players: { name: string; position: string; avatar: string; jerseyNumber: number }[];
}

interface QuickImportProps {
  onImport: (data: ParsedData, format: string) => void;
  currentFormat: string;
}

export const QuickImport: React.FC<QuickImportProps> = ({ onImport, currentFormat }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [parsed, setParsed] = useState<ParsedData | null>(null);
  const [selectedFormat, setSelectedFormat] = useState(currentFormat);

  const parseText = (input: string, format: string) => {
    // 提取日期
    const dateMatch = input.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    const matchDate = dateMatch ? `${dateMatch[1]}-${dateMatch[2].padStart(2,'0')}-${dateMatch[3].padStart(2,'0')}` : '';
    
    // 提取时间
    const timeMatch = input.match(/(\d{1,2})点/);
    const matchTime = timeMatch ? `${timeMatch[1].padStart(2,'0')}:00` : '';
    
    // 提取地点
    const locationMatch = input.match(/地点[：:](.*?)(?:\n|$)/);
    const location = locationMatch ? locationMatch[1].trim() : '';
    
    // 提取球员名单
    const playerMatches = input.match(/\d+[.\u3001]\s*([^\n\d]+)/g) || [];
    const playerNames = playerMatches.map(m => {
      const name = m.replace(/^\d+[.\u3001]\s*/, '').trim().split(/[\s\uff08\(]/)[0];
      return name;
    }).filter(n => n && n.length > 0 && n.length < 10);

    // 根据用户选择的赛制分配位置
    const positions = assignPositions(playerNames.length, format);
    
    // 跟踪已使用的图片，避免重复
    const usedAvatars = new Set<string>();
    
    const players = playerNames.map((name, i) => {
      const pos = positions[i] || 'MF';
      const avatar = getUniqueAvatar(pos, usedAvatars);
      return {
        name,
        position: pos,
        avatar,
        jerseyNumber: i + 1,
      };
    });

    return { matchDate, matchTime, location, players };
  };

  const getUniqueAvatar = (pos: string, usedAvatars: Set<string>): string => {
    const avatars = POSITION_AVATARS[pos] || POSITION_AVATARS.MF;
    
    // 找一个未使用的图片
    for (const avatar of avatars) {
      if (!usedAvatars.has(avatar)) {
        usedAvatars.add(avatar);
        return avatar;
      }
    }
    
    // 如果所有图片都用过了，从其他位置借用
    const allAvatars = Object.values(POSITION_AVATARS).flat();
    for (const avatar of allAvatars) {
      if (!usedAvatars.has(avatar)) {
        usedAvatars.add(avatar);
        return avatar;
      }
    }
    
    // 实在没有了，返回第一个
    return avatars[0];
  };

  const assignPositions = (count: number, format: string): string[] => {
    const formations: Record<string, string[]> = {
      '5v5': ['GK', 'DF', 'DF', 'MF', 'FW'],
      '7v7': ['GK', 'DF', 'DF', 'MF', 'MF', 'MF', 'FW'],
      '11v11': ['GK', 'DF', 'DF', 'DF', 'DF', 'MF', 'MF', 'MF', 'FW', 'FW', 'FW'],
    };
    
    const base = formations[format] || formations['5v5'];
    const result: string[] = [];
    
    for (let i = 0; i < count; i++) {
      if (i < base.length) {
        result.push(base[i]);
      } else {
        result.push(['DF', 'MF', 'FW'][(i - base.length) % 3]);
      }
    }
    return result;
  };

  const handleParse = () => {
    const data = parseText(text, selectedFormat);
    setParsed(data);
  };

  const handleImport = () => {
    if (parsed) {
      onImport(parsed, selectedFormat);
      setOpen(false);
      setText('');
      setParsed(null);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<ContentPaste />}
        onClick={() => { setOpen(true); setSelectedFormat(currentFormat); }}
      >
        快速导入报名
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <AutoAwesome sx={{ mr: 1, verticalAlign: 'middle', color: 'warning.main' }} />
          快速导入报名接龙
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            粘贴报名接龙信息，自动识别球员名单和比赛信息
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>比赛赛制</InputLabel>
            <Select
              value={selectedFormat}
              label="比赛赛制"
              onChange={(e) => { setSelectedFormat(e.target.value); setParsed(null); }}
            >
              <MenuItem value="5v5">5人制</MenuItem>
              <MenuItem value="7v7">7人制</MenuItem>
              <MenuItem value="11v11">11人制</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            multiline
            rows={8}
            fullWidth
            placeholder="粘贴报名接龙内容..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Button variant="outlined" onClick={handleParse} disabled={!text.trim()}>
            解析内容
          </Button>

          {parsed && parsed.players.length > 0 && (
            <Paper sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.2)' }}>
              <Typography variant="h6" gutterBottom>解析结果</Typography>
              
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                <Chip label={`赛制: ${selectedFormat}`} color="primary" />
                {parsed.matchDate && <Chip icon={<Event />} label={parsed.matchDate} />}
                {parsed.matchTime && <Chip icon={<Event />} label={parsed.matchTime} />}
                {parsed.location && <Chip icon={<LocationOn />} label={parsed.location} />}
              </Stack>
              
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                <Groups sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} />
                识别到 {parsed.players.length} 位球员:
              </Typography>
              
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {parsed.players.map((p, i) => (
                  <Chip
                    key={i}
                    avatar={<Avatar src={p.avatar} />}
                    label={`${p.jerseyNumber}. ${p.name} (${p.position})`}
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Paper>
          )}

          {parsed && parsed.players.length === 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              未识别到球员名单
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button 
            variant="contained" 
            onClick={handleImport}
            disabled={!parsed || parsed.players.length === 0}
          >
            导入到战术板
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
