import React from "react";
import {GoInfo} from 'react-icons/go';
import {
    Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader,
    DrawerOverlay, IconButton, Text, useDisclosure, VStack
} from '@chakra-ui/react';
import {ISolution, ISolutionStatus } from "../models";

export const SolutionCheckSystemInfo: (solution: ISolution) => JSX.Element = (solution: ISolution) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const theme = {
        bg: 'gray.500',
        text: 'Не отправлялось',
    };
    if (solution.status === ISolutionStatus.ERROR) {
        theme.bg = 'red.500';
        theme.text = 'Доработать';
    } else if (solution.status === ISolutionStatus.ON_REVIEW) {
        theme.bg = 'yellow.500';
        theme.text = 'На проверке';
    } else if (solution.status === ISolutionStatus.COMPLETE_NOT_MAX) {
        theme.bg = 'green.300'
        theme.text = 'Зачтено'
    } else if (solution.status === ISolutionStatus.COMPLETE) {
        theme.bg = 'green.600'
        theme.text = 'Зачтено'
    }
    return (
        <>
            <IconButton aria-label={"Test system information"}
                        icon={<GoInfo/>}
                        onClick={onOpen}
                        bg={"transparent"}
                        bgColor={theme.bg}
                        border={"1px"}
                        _hover={{"background": "transparent"}}
            />
            <Drawer onClose={onClose}
                    isOpen={isOpen}
                    size={"lg"}
            >
                <DrawerOverlay/>
                <DrawerContent borderRadius="3px">
                    <DrawerCloseButton/>
                    <DrawerHeader fontSize="4xl"
                                  borderBottomWidth="1px"
                    >
                        Решение № {solution.id}
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack spacing={1} alignItems={"flex-start"}>
                        {
                            solution.check_system_answer?.split("\n").map((st, i) => {
                                return <Text whiteSpace={"pre"} fontSize="lg" children={st} textAlign={"left"} key={i}/>
                            })
                        }
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}