import { FC } from 'react';
import { BiSolidTimeFive } from 'react-icons/bi';

import { Feature } from '@/models/project';

type Props = {
  feature: Feature;
};

const FeatureCard: FC<Props> = props => {
  const {
    feature: { priority, name, description, finishDate },
  } = props;

  const currentDate = new Date();
  const featureFinishDate = new Date(finishDate);
  const timeDifference = featureFinishDate.getTime() - currentDate.getTime();
  const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));

  return (
    <div className='my-5 bg-white p-5 rounded-2xl'>
      <span className='bg-[#dfa87433] text-[#D58D49] rounded-[4px] px-[6px] py-1 font-medium text-xs'>
        {priority}
      </span>

      <h2 className='my-1 text-[#0D062D]'>{name}</h2>

      <p className='text-[#787486] text-xs'>{description}</p>

      <div className='mt-7 flex items-center justify-between'>
        <p className='text-xs flex items-center bg-purple-200 px-2 py-1 text-purple-800 font-medium'>
          <BiSolidTimeFive />
          {daysLeft} Days Left
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
