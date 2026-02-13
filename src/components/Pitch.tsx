import type { Player } from '../types';
import { useDroppable } from '@dnd-kit/core';
import { Box, Paper } from '@mui/material';
import { useGameStore } from '../store/gameStore';
import { FORMATIONS, PITCH_DIMENSIONS } from '../data/formations';
import type { Position } from '../data/formations';
import { DraggablePlayer } from './DraggablePlayer';

export const Pitch: React.FC = () => {
  const { gameFormat, selectedFormation, lineup } = useGameStore();

  const formationSet = FORMATIONS[gameFormat];
  const currentFormation = formationSet[selectedFormation];
  const dimensions = PITCH_DIMENSIONS[gameFormat];

  if (!currentFormation) return null;

  return (
    <Paper
      sx={{
        position: 'relative',
        width: '100%',
        paddingTop: `${(dimensions.height / dimensions.width) * 100}%`,
        background: 'linear-gradient(to bottom, #1a472a 0%, #2d5a3d 50%, #1a472a 100%)',
        borderRadius: 2,
        overflow: 'hidden',
        border: '3px solid #fff',
        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.3)',
      }}
    >
      {/* Field markings */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {/* Center line */}
        <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, bgcolor: 'rgba(255,255,255,0.5)' }} />
        {/* Center circle */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '20%',
          paddingTop: '20%',
          border: '2px solid rgba(255,255,255,0.5)',
          borderRadius: '50%',
        }} />
        {/* Goal areas */}
        <Box sx={{ position: 'absolute', top: 0, left: '30%', right: '30%', height: '15%', border: '2px solid rgba(255,255,255,0.5)', borderTop: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: 0, left: '30%', right: '30%', height: '15%', border: '2px solid rgba(255,255,255,0.5)', borderBottom: 'none' }} />
      </Box>

      {/* Player positions */}
      {currentFormation.positions.map((pos: Position, index: number) => (
        <PositionSlot
          key={index}
          index={index}
          x={pos.x}
          y={pos.y}
          player={lineup[index]}
          positionLabel={pos.label}
        />
      ))}
    </Paper>
  );
};

interface PositionSlotProps {
  index: number;
  x: number;
  y: number;
  player: Player | null;
  positionLabel: string;
}

const PositionSlot: React.FC<PositionSlotProps> = ({ index, x, y, player, positionLabel }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `position-${index}`,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        width: 95,
        height: 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        border: isOver ? '2px dashed #4caf50' : '2px dashed rgba(255,255,255,0.3)',
        bgcolor: isOver ? 'rgba(76, 175, 80, 0.2)' : 'transparent',
        transition: 'all 0.2s ease',
      }}
    >
      {player ? (
        <DraggablePlayer player={player} />
      ) : (
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: '2px dashed rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.8rem',
            fontWeight: 'bold',
          }}
        >
          {positionLabel}
        </Box>
      )}
    </Box>
  );
};
