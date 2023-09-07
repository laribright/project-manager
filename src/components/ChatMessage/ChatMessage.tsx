import { FC } from 'react';
import { FaRobot } from 'react-icons/fa';

type Props = {
  text: string;
  role: 'user' | 'assistant';
  userImage: string;
};

const ChatMessage: FC<Props> = props => {
  const { role, text, userImage } = props;

  return (
    <>
      {role === 'user' && (
        <div className='bg-white p-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap'>
          <img src={userImage} alt='user' className='w-8 h-8' />
          <p className='text-gray-700'>{text}</p>
        </div>
      )}
      {role === 'assistant' && (
        <div className='bg-gray-100 mb-6 p-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap'>
          <FaRobot className='text-[10rem]' />
          <p className="text-gray-700">{text}</p>
        </div>
      )}
    </>
  );
};

export default ChatMessage;
