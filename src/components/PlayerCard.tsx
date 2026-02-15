import { useState } from 'react';
import { Card, CardContent, Typography, Box, Avatar, IconButton } from '@mui/material';
import { Person, Flip } from '@mui/icons-material';
import type { Player, CardRarity } from '../types';

// 位置球星图片
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
  // 细分位置也映射
  CB: [CB01, CB02, CB03], LB: [LB01, LB02], RB: [RB01, RB02],
  CDM: [CDM01, CDM02], CM: [CM01, CM02], CAM: [CAM01],
  LM: [LM01], RM: [RM01], LW: [LW02], RW: [LW02],
  LWB: [LB01, LB02], RWB: [RB01, RB02],
  ST: [ST01, ST02, ST03, ST04, ST05, ST06], CF: [ST01, ST02, ST03],
};

const getDefaultAvatar = (position: string, playerId: string): string => {
  const avatars = POSITION_AVATARS[position] || POSITION_AVATARS.MF;
  // 用 playerId 的 hash 来稳定分配，同一个球员每次都拿到同一张图
  let hash = 0;
  for (let i = 0; i < playerId.length; i++) hash = ((hash << 5) - hash + playerId.charCodeAt(i)) | 0;
  return avatars[Math.abs(hash) % avatars.length];
};

interface PlayerCardProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
  isDragging?: boolean;
  isFlipped?: boolean;
  matchRating?: number;
}

const rarityColors: Record<CardRarity, string> = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  special: '#9c27b0',
};

const sizeMap = {
  sm: { width: 90, height: 115, avatarSize: 60, nameSize: '0.75rem', numSize: 30 },
  md: { width: 110, height: 140, avatarSize: 70, nameSize: '0.85rem', numSize: 40 },
  lg: { width: 140, height: 175, avatarSize: 90, nameSize: '0.95rem', numSize: 52 },
};

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  size = 'md',
  isDragging = false,
  isFlipped: isFlippedProp,
  matchRating,
}) => {
  const [isFlippedInternal, setIsFlippedInternal] = useState(false);
  const isFlipped = isFlippedProp !== undefined ? isFlippedProp : isFlippedInternal;
  const config = sizeMap[size];
  const rarityColor = rarityColors[player.rarity || 'gold'];
  const displayRating = matchRating !== undefined ? Math.round(matchRating * 10) : 85;

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isFlippedProp === undefined) {
      setIsFlippedInternal(!isFlippedInternal);
    }
  };

  const avatarSrc = getDefaultAvatar(player.position || player.preferredPosition || 'MF', player.id);
  console.log('[PlayerCard]', player.name, 'pos=', player.position, 'avatar=', avatarSrc);

  return (
    <Box
      sx={{
        width: config.width,
        height: config.height,
        perspective: '1000px',
        cursor: 'grab',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <Card
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            opacity: isDragging ? 0.5 : 1,
            border: `2px solid ${rarityColor}`,
            background: `linear-gradient(145deg, ${rarityColor}33 0%, #0d1f2d 50%, ${rarityColor}22 100%)`,
            boxShadow: `0 4px 15px rgba(0,0,0,0.5)`,
          }}
        >
          {/* Position Badge */}
          <Box
            sx={{
              position: 'absolute',
              top: 2,
              left: 2,
              bgcolor: rarityColor,
              color: '#000',
              borderRadius: 1,
              px: 0.5,
              py: 0.2,
              fontWeight: 'bold',
              fontSize: '0.55rem',
              zIndex: 1,
            }}
          >
            {player.position}
          </Box>

          {/* Flip Button */}
          <IconButton
            size="small"
            onClick={handleFlip}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              color: rarityColor,
              p: 0.3,
              zIndex: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <Flip sx={{ fontSize: 14 }} />
          </IconButton>

          <CardContent sx={{ p: 0.5, pt: 1.5, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Avatar
              src={avatarSrc}
              sx={{
                width: config.avatarSize,
                height: config.avatarSize,
                mb: 0.5,
                bgcolor: 'primary.dark',
                border: `3px solid ${rarityColor}`,
                boxShadow: `0 0 10px ${rarityColor}55`,
              }}
            >
              <Person sx={{ fontSize: config.avatarSize * 0.6 }} />
            </Avatar>

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: config.nameSize,
                color: '#fff',
                maxWidth: '100%',
                px: 0.3,
                lineHeight: 1.3,
                textAlign: 'center',
                wordBreak: 'keep-all',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              }}
            >
              {player.name}
            </Typography>
          </CardContent>
        </Card>

        {/* Back */}
        <Card
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            border: `2px solid ${rarityColor}`,
            background: `linear-gradient(145deg, #0d1f2d 0%, ${rarityColor}55 50%, #0d1f2d 100%)`,
            boxShadow: `0 4px 15px rgba(0,0,0,0.5)`,
          }}
        >
          {/* Flip Back Button */}
          <IconButton
            size="small"
            onClick={handleFlip}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              color: rarityColor,
              p: 0.3,
              zIndex: 2,
              transform: 'rotateY(180deg)',
            }}
          >
            <Flip sx={{ fontSize: 14 }} />
          </IconButton>

          <CardContent sx={{ p: 0.5, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography
              sx={{
                fontSize: config.numSize,
                fontWeight: 900,
                color: rarityColor,
                textShadow: `0 0 20px ${rarityColor}, 0 0 40px ${rarityColor}`,
                lineHeight: 1,
                fontFamily: '"Arial Black", Impact, sans-serif',
              }}
            >
              {player.jerseyNumber || '?'}
            </Typography>
            <Typography sx={{ fontSize: config.nameSize, fontWeight: 600, color: '#fff', mt: 1 }}>
              {player.name}
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: displayRating >= 80 ? '#4caf50' : displayRating >= 60 ? '#2196f3' : '#f44336', mt: 0.5, fontWeight: 700 }}>
              评分 {displayRating}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
