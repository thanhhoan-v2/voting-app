'use client';

interface VoteButtonProps {
  optionId: number;
  optionText: string;
  voteCount: number;
  pollId: number;
  onVote: (optionId: number) => void;
}

export default function VoteButton({ optionId, optionText, voteCount, pollId, onVote }: VoteButtonProps) {
  return (
    <button
      onClick={() => onVote(optionId)}
      className="vote-option w-full text-left p-6"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-neutral-300 rounded-full"></div>
          <span className="text-body text-lg font-medium">
            {optionText}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="vote-badge">
            {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
          </span>
        </div>
      </div>
    </button>
  );
}