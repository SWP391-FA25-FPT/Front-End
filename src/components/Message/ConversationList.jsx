// src/components/Message/ConversationList.jsx
// SỬA LỖI: Gỡ bỏ class Tailwind 'h-full overflow-y-auto'

import React from 'react';
import ConversationListItem from './ConversationListItem';

const ConversationList = ({ conversations, onSelectConversation, currentSelectedId }) => {
    return (
        // Bỏ 'h-full overflow-y-auto' vì cha (MessagesPage) đã lo việc cuộn
        <div> 
            {conversations.length === 0 ? (
                <div className="p-4 text-center text-muted mt-5">
                    Bạn chưa có đoạn hội thoại nào.
                </div>
            ) : (
                conversations.map((conv) => (
                    <ConversationListItem 
                        key={conv._id}
                        conversation={conv}
                        onSelectConversation={onSelectConversation}
                        isSelected={conv._id === currentSelectedId}
                    />
                ))
            )}
        </div>
    );
};

export default ConversationList;