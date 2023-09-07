import { ChangeEventHandler, FC, FormEvent } from 'react';
import { MdCancel } from 'react-icons/md';

import Input from '../Input/Input';

type Props = {
  isVisible: boolean;
  isSubmitting: boolean;
  toggleAddBoardForm: () => void;
  handleBoardSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  boardData: {
    status: string;
  };
  updateBoardHandler: ChangeEventHandler<HTMLInputElement>;
};

const AddBoardForm: FC<Props> = props => {
  const {
    isVisible,
    toggleAddBoardForm,
    handleBoardSubmit,
    isSubmitting,
    boardData,
    updateBoardHandler,
  } = props;

  return (
    <div
      className={`absolute w-80 z-[55] bg-gray-200 rounded-lg shadow ${
        isVisible
          ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-700'
          : '-translate-y-[150%] left-1/2 -translate-x-1/2'
      }`}
    >
      <button
        type='button'
        className='absolute top-3 right-2.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center bg-gray-600'
      >
        <MdCancel onClick={toggleAddBoardForm} className='text-3xl' />
      </button>

      <div className='px-6 py-6 lg:px-8'>
        <h3 className='mb-4 text-xl font-medium'>Add Project Board</h3>

        <form onSubmit={handleBoardSubmit} className='space-y-6'>
          <Input
            type='text'
            name='status'
            label='Board Status'
            placeholder='e.g To Do'
            required
            value={boardData.status}
            onChange={updateBoardHandler}
          />

          <button
            disabled={isSubmitting}
            type='submit'
            className='disabled:bg-gray-300 w-full text-white bg-blue-700 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
          >
            {isSubmitting ? 'Submitting...' : 'Add Board'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBoardForm;
