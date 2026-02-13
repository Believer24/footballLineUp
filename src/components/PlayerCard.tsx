import { useState } from 'react';
import { Card, CardContent, Typography, Box, Avatar, IconButton } from '@mui/material';
import { Person, Flip } from '@mui/icons-material';
import type { Player, CardRarity } from '../types';

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
              src={player.avatar}
              sx={{
                width: config.avatarSize,
                height: config.avatarSize,
                mb: 0.5,
                bgcolor: 'primary.dark',
                border: `3px solid ${rarityColor}`,
                boxShadow: `0 0 10px ${rarityColor}55`,
              }}
            >
              {!player.avatar && <Person sx={{ fontSize: config.avatarSize * 0.6 }} />}
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
