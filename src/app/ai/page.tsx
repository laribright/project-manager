'use client';

import AnimatedSpinner from '@/components/AnimatedSpinner/AnimatedSpinner';
import ChatMessage from '@/components/ChatMessage/ChatMessage';
import Input from '@/components/Input/Input';
import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Ai = () => {
  const [chat, setChat] = useState<
    {
      role: 'user' | 'assistant';
      content: string;
      id: string;
      userId: string;
    }[]
  >([]);
  const [userImage, setUserImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [promptData, setPromptData] = useState<{
    prompt: string;
    role: 'user' | 'assistant';
  }>({ prompt: '', role: 'user' });

  useEffect(() => {
    const fetchUserMessages = async () => {
      const { data } = await axios.get('/api/ai/');
      setUserImage(data.image);
      setChat(data.aiChat);
    };

    fetchUserMessages();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await axios.post('/api/ai', promptData);
    } catch (error) {
      console.log(error);
      toast.error("Something wen't wrong");
    } finally {
      setIsLoading(false);
      setPromptData({ prompt: '', role: 'user' });
    }
  };

  return (
    <>
      <form className='sticky top-0' onSubmit={handleSubmit}>
        <Input
          type='text'
          label='Prompt AI'
          name='prompt'
          onChange={e =>
            setPromptData({ ...promptData, prompt: e.target.value })
          }
          placeholder='Type your prompt'
          value={promptData.prompt}
          required
          disabled={isLoading}
        />
        {isLoading && <AnimatedSpinner />}
      </form>

      <div className='mt-10'>
        {chat.map(chatMsg => (
          <ChatMessage
            key={chatMsg.id}
            role={chatMsg.role}
            text={chatMsg.content}
            userImage={userImage}
          />
        ))}
      </div>
    </>
  );
};

export default Ai;
