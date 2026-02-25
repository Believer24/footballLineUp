import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Player } from '../types';
import { PlayerCard } from './PlayerCard';
import { useGameStore } from '../store/gameStore';

interface DraggablePlayerProps {
  player: Player;
}

export const DraggablePlayer: React.FC<DraggablePlayerProps> = ({ player }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: player.id,
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const matchRatings = useGameStore((s) => s.matchRatings);
  const matchRating = matchRatings[player.name];

  const handleClick = () => {
    if (!isDragging) {
      setIsFlipped(prev => !prev);
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      style={{ touchAction: 'none' }}
    >
      <PlayerCard player={player} size="sm" isDragging={isDragging} isFlipped={isFlipped} matchRating={matchRating} />
    </div>
  );
};
