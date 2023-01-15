import React from 'react';

import ChatBlob from './ChatBlob';
import { IChatMessage } from '../models';

export const ChatMessage: (props: IChatMessage) => JSX.Element = (
	props: IChatMessage
) => {
	return (
		<ChatBlob
			user_id={props.from_id}
			text={props.message_text}
			date={props.date}
		/>
	);
};
