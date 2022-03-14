import React from 'react';
import PropTypes from 'prop-types';

import { Box, Text } from '@chakra-ui/react';

export interface IChatBlob {
    name: string
    text: string
}

export default function ChatBlob({ name, text }: IChatBlob) {
    return (
        <Box
            bg="gray50"
            borderWidth="1px"
            borderRadius="md"
            style={{
                padding: '0.5em',
            }}
        >
            <Box
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
            >
                {name}
            </Box>
            <Text color="gray.500">{text}</Text>
        </Box>
    );
}
