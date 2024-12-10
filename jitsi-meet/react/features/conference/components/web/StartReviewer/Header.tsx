import React, { useContext } from 'react';
import { SocketContext } from './Main';

interface User {
  username: string;
}

interface HeaderProps {
  numberOfConnectedUsers?: number;
  moderator?: User | null;
  numberOfSubmissions?: number;
  displayReviewers: boolean;
}

const Header: React.FC<HeaderProps> = ({
  numberOfConnectedUsers = 0,
  moderator = null,
  numberOfSubmissions = 0,
  displayReviewers,
}) => {
  const socket = useContext(SocketContext);

  const goToReviewersList = () => {
    const message = JSON.stringify({
      action: "RETRIEVE_REVIEWER_LIST",
    });
    socket.send(message);
  };

  return (
    <div className="mb-[2rem]">
      <div className="flex justify-between mb-[1rem]">
        {!displayReviewers ? (
          <button onClick={goToReviewersList} className="mb-[2rem] black">
            &lt;- Reviewers List
          </button>
        ) : (
          <p></p>
        )}

        <div className="flex gap-[20px]">
          <p className='black'>Moderator: {moderator ? moderator.username : 'No moderator'}</p>
          <p className='black'>
            Submissions: {numberOfSubmissions}/{numberOfConnectedUsers}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;