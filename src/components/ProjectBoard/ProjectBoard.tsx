'use client';

import { Dispatch, FC, SetStateAction } from 'react';

type Props = {
  boardHeading: string;
  toggleAddFeature: () => void;
  setSelectedBoardId: Dispatch<SetStateAction<string>>;
  boardId: string;
  numFeatures: number;
};

const ProjectBoard: FC<Props> = props => {
  const {
    boardHeading,
    boardId,
    numFeatures,
    setSelectedBoardId,
    toggleAddFeature,
  } = props;

  return (
    <div className='flex flex-row justify-between items-center pb-6 border-b-2 border-b-[#30e575]'>
      <div className='flex items-center'>
        <div className='w-2 h-2 bg-[#30e575] rounded-full mr-2' />
        <p className='font-medium mr-3'>{boardHeading}</p>
        <p className='w-6 h-6 text-center flex items-center justify-center bg-[#e0e0e0] text-[#625f6d] rounded-full'>
          {numFeatures}
        </p>
      </div>

      <button
        onClick={() => {
          toggleAddFeature();
          setSelectedBoardId(boardId);
        }}
        className='text-white bg-[#30e575] px-3 py-1 rounded-lg font-medium text-lg'
      >
        +
      </button>
    </div>
  );
};

export default ProjectBoard;
