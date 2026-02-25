import { useDroppable } from '@dnd-kit/core';
import { Box, Typography } from '@mui/material';
import { useGameStore } from '../store/gameStore';
import { DraggablePlayer } from './DraggablePlayer';

export const Bench: React.FC = () => {
  const { bench } = useGameStore();
  const { setNodeRef, isOver } = useDroppable({ id: 'bench' });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        minHeight: 120,
        p: 2,
        borderRadius: 2,
        bgcolor: isOver ? 'rgba(33, 150, 243, 0.1)' : 'rgba(0,0,0,0.2)',
        border: isOver ? '2px dashed #2196f3' : '2px dashed transparent',
        transition: 'all 0.2s ease',
      }}
    >
      {bench.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={3}>
          暂无替补球员，请在"比赛报名"页面添加球员
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          {bench.map((player) => (
            <DraggablePlayer key={player.id} player={player} />
          ))}
        </Box>
      )}
    </Box>
  );
};
