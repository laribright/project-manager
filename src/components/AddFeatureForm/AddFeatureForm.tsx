import { ChangeEvent, FC, FormEvent } from 'react';
import { MdCancel } from 'react-icons/md';
import Input from '../Input/Input';

type Props = {
  isVisible: boolean;
  toggleAddFeatureForm: () => void;
  handleFeatureSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleFeatureChange: (event: ChangeEvent<HTMLInputElement>) => void;
  featureFormData: {
    name: string;
    description: string;
    finishDate: string;
  };
};

const AddFeatureForm: FC<Props> = props => {
  const {
    isVisible,
    featureFormData,
    handleFeatureChange,
    handleFeatureSubmit,
    toggleAddFeatureForm,
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
        <MdCancel onClick={toggleAddFeatureForm} className='text-3xl' />
      </button>

      <div className='px-6 py-6 lg:px-8'>
        <form onSubmit={handleFeatureSubmit} className='space-y-6'>
          <Input
            label='Feature Name'
            name='name'
            type='text'
            placeholder='Enter Feature name'
            value={featureFormData.name}
            onChange={handleFeatureChange}
            required
          />
          <Input
            label='Description'
            name='description'
            type='text'
            placeholder='Enter Description'
            value={featureFormData.description}
            onChange={handleFeatureChange}
            required
          />
          <Input
            label='Finish Date'
            name='finishDate'
            type='date'
            placeholder='Select Finish Date'
            value={featureFormData.finishDate}
            onChange={handleFeatureChange}
            required
          />

          <button
            className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
            type='submit'
          >
            Create Feature
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFeatureForm;
