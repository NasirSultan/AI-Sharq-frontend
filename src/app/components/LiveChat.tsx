import React from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { MdSend, MdMailOutline } from 'react-icons/md';

interface Message {
  id: number;
  name: string;
  avatar: string;
  text: string;
  likes: number;
  time: string;
}

const messages: Message[] = [
  {
    id: 1,
    name: 'Dr. Johnathan',
    avatar: '/images/liveman.png',
    text: '“Really appreciate the depth of insights you’ve shared on AI implementation today. It’s not just the technology, but the way you explained its impact on different industries that makes it so much clearer. Definitely taking notes for how this can be applied in my own work.',
    likes: 12,
    time: '2 min ago',
  },
  {
    id: 2,
    name: 'Sarah Thompson',
    avatar: '/images/liveman.png',
    text: '“I’m really looking forward to the upcoming Q&A segment. There’s so much valuable information already, but I’m excited to see the questions from the audience and hear your thoughts on some real-world challenges people might be facing.',
    likes: 15,
    time: '5 min ago',
  },
  {
    id: 3,
    name: 'Michael Lee',
    avatar: '/images/liveman.png',
    text: 'Excellent presentation! 👏 Your ability to break down complex topics into easy-to-understand concepts is impressive. It kept me fully engaged from start to finish. Honestly, one of the best talks I’ve attended this year.',
    likes: 18,
    time: '10 min ago',
  },
  {
    id: 4,
    name: 'Emma Garcia',
    avatar: '/images/liveman.png',
    text: 'I was especially impressed by the statistics you presented. They really highlighted the scale of change that AI is driving across different sectors. Those numbers make it crystal clear why this is such an important topic right now.',
    likes: 22,
    time: '1 min ago',
  },
];

const LiveChat: React.FC = () => {
  return (
    <div className="absolute w-[1282px] h-[659px] left-[80px] ">
      {/* Live Session Chat Title */}
      <div className="absolute w-[250px] h-[17px] left-[80px] top-[806px] text-2xl font- font-bold text-[#282828] font-['IBM Plex Sans']">
     Live Session Chat
      </div>

      {/* Messages Container */}
      <div className="absolute w-[1180px] h-[519px] left-[80px] top-[996px] flex flex-col gap-[9px] overflow-y-auto">
        {messages.map(({ id, name, avatar, text, likes, time }) => (
          <div key={id} className="w-full h-[153px] bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <div className="flex items-start gap-3">
                <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-gray-200 p-2.5" />
                <div className="flex flex-col gap-4.5">
                  <div className="text-base font-medium text-[#282828] font-['IBM Plex Sans']">{name}</div>
                  <div className="text-sm text-[#616161] font-['IBM Plex Sans'] leading-5">{text}</div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1 text-[#9B2033] font-['IBM Plex Sans']">
                      <FaThumbsUp className="w-3 h-3" />
                      <span className="text-sm">{likes}</span>
                    </div>
                    <div className="w-1 h-1 bg-[#9B2033] rounded-full"></div>
                    <span className="text-sm text-[#616161] font-['IBM Plex Sans']">{time}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="absolute w-[1202px] h-[53px] left-[80px] top-[908px] flex flex-row gap-1.5">
        <div className="flex-1 h-full border border-gray-300 rounded-lg flex items-center px-5 py-4 gap-3">
          <input
            type="text"
            placeholder="Share your thoughts..."
            className="flex-1 text-base text-[#616161] font-['IBM Plex Sans'] bg-transparent outline-none"
          />
          <MdMailOutline className="w-5 h-5 text-gray-400" />
        </div>
        <button className="w-[61px] h-full bg-[#FFEFF2] rounded-lg flex items-center justify-center">
          <MdSend className="w-6 h-6 text-[#9B2033]" />
        </button>
      </div>
    </div>
  );
};

export default LiveChat;
