import React from 'react';
import PropTypes from 'prop-types';

import { Box, Flex, Image } from '@chakra-ui/react';

import ChatBlob from './ChatBlob';

export interface IChatMessage {
    userId: number | string;
    text: string;
}

export const ChatMessage: ({ userId, text }: IChatMessage) => JSX.Element = ({ userId, text }: IChatMessage) => {
    const image = 'https://avatars.githubusercontent.com/u/26022093?v=4';
    const clientId = 1;
    const clientName = 'Dungeon Master';

    return (
        <Flex
            style={{
                marginBottom: '1vh',
            }}
        >
            <Box flex="1">
                {clientId !== userId ? (
                    <Flex>
                        <Box>
                            <Image borderRadius="full" boxSize="32px" src={image} />
                        </Box>
                        <Box
                            flex="1"
                            style={{
                                paddingLeft: '0.2em',
                            }}
                        >
                            <ChatBlob name={clientName} text={text}/>
                        </Box>
                        <Box w="3vw" />
                    </Flex>
                ) : (
                    <Flex>
                        <Box w="3vw" />
                        <Box flex="1">
                            <ChatBlob name={clientName} text={text} />
                        </Box>
                    </Flex>
                )}
            </Box>
        </Flex>
    );
}