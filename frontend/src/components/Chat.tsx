import React, {useEffect, useRef} from 'react';
import {useParams} from "react-router";

import {Flex, Box} from '@chakra-ui/react';

import {ChatMessage, ChatInput} from "./index";

import {useActions, useTypedSelector} from "../hooks";


export function Chat() {
    const {chatMessages, isLoadingChatMessages} = useTypedSelector(state => state.chatMessages)
    const {fetchChatMessages, clearChatMessages} = useActions()
    const {groupId, courseId, taskId} = useParams();
    const {selectedUser, isLoading: isLoadingSelectedUser} = useTypedSelector(state => state.selectedUser)
    const messagesEndRef = useRef<null | HTMLDivElement>(null)
    const {users, usersIsLoading} = useTypedSelector(state => state.usersData)
    const {fetchUserData} = useActions()


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", inline: 'nearest', block: "end" })
        console.log("Scroll")
    }
    useEffect(() => {
        fetchChatMessages(groupId!, courseId!, taskId!, selectedUser?.id)
        const loadedUsersIds = users.map((user) => user.id)
        const neededUsersIds = chatMessages.map((message) => message.from_id)
            .filter(x => !loadedUsersIds.includes(x))
        const neededUsersIdWithoutRepeats = neededUsersIds.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
        })
        console.log(loadedUsersIds, neededUsersIdWithoutRepeats)
        for (const userId in neededUsersIdWithoutRepeats) {
            fetchUserData(userId)
        }

    }, [selectedUser])
    useEffect(() => {
        // TODO: костыльное решение с прокруткой чата
        if (!isLoadingChatMessages) {
            //sleep(700).then(() => scrollToBottom())
        }
    }, [isLoadingChatMessages])
    return (
        <Flex direction="column" >
            <Flex maxH="60vh" direction="column" overflowY={"scroll"} width={"100%"} mb={2} overflow={"auto"} sx={{
                '&::-webkit-scrollbar': {
                    width: '16px',
                    borderRadius: '8px',
                    backgroundColor: `rgba(170, 170, 170, 0.05)`,
                },
                '&::-webkit-scrollbar-thumb': {
                    width: '16px',
                    borderRadius: '8px',
                    backgroundColor: `rgba(170, 170, 170, 0.05)`,
                },
            }}
                  ref={messagesEndRef}
            >
                {chatMessages?.map((message, index) => {
                        return <ChatMessage key={index} {...message}/>
                    }
                )}

            </Flex>

            <Box>
                <ChatInput/>
            </Box>
        </Flex>
    );
}