import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {
    Button,
    Center,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import {TaskAttachment} from "../components/TaskAttachment";
import {TaskInfo} from "../components/TaskInfo";
import fileDialog from "file-dialog";
import {BiSend, GoFileCode} from 'react-icons/all';
import {ISolutionStatus, ITask} from "../models/ITask";
import SolutionService from "../services/SolutionService";
import {TaskStudentsList} from "../components/TaskStudentsList";
import {IGroupRole} from "../models/IGroupRole";
import GroupService from "../services/GroupService";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";
import TaskService from "../services/TaskService";
import {BorderShadowBox} from "../components/BorderShadowBox";
import {ISolution} from "../models/ISolution";
import {SolutionInfo} from "../components/SolutionInfo";

export default function TaskPage() {
    const {groupId, courseId, lessonId, taskId} = useParams();
    const [task, setTask] = useState<ITask>()
    const [groupRole, setGroupRole] = useState<IGroupRole>()
    const {setSolution, setSelectedUser, clearSolution, clearSelectedUser} = useActions()
    const {current_solution, isChanged: solutionIsChanged} = useTypedSelector(state => state.solution)
    const {user} = useTypedSelector(state => state.auth)
    const {selectedUser} = useTypedSelector(state => state.selectedUser)

    const {isOpen, onOpen, onClose} = useDisclosure()
    const [solutions, setSolutions] = useState<ISolution[]>([])

    const sendFileFromDialog = () => {
        fileDialog().then(async (files) => {
            /*TODO: image_load
            const formData = new FormData()
            formData.append("file", files[0], files[0].name)
            const requestConfig: IRequestConfig = {
                method: "post",
                url: "/page_data/upload_image",
                auth: true,
                headers: {'Content-Type': 'multipart/form-data'},
                data: formData
            }
            const resp = await request(requestConfig)
            console.log(resp)
             */
            SolutionService.postSolution(groupId!, courseId!, lessonId!, taskId!, files)
                .then((solution) => setSolution(solution))
        })
    }

    useEffect(() => {
        GroupService.getGroupRole(groupId!).then((role) => setGroupRole(role))
        TaskService.getTask(groupId!, courseId!, lessonId!, taskId!).then((task) => setTask(task))
    }, [])

    useEffect(() => {
        console.log(groupRole)
        console.log(user)
        console.log(groupRole === IGroupRole.STUDENT)
        if (groupRole === IGroupRole.STUDENT) {
            setSelectedUser(user!)
            SolutionService.getBestSolution(groupId!, courseId!, taskId!).then((solution) => {
                if (solution)
                    setSolution(solution)
                else
                    setSolution({
                        id: -1,
                        score: 0,
                        status: ISolutionStatus.UNDEFINED,
                        code: "",
                        time_start: new Date
                    } as ISolution)
            })
        }
    }, [groupRole])

    useEffect(() => {
        if (selectedUser)
            SolutionService.getAllTaskSolutionsByUserId(groupId!, courseId!, taskId!, selectedUser.id).then((solutions) => {
                setSolutions(solutions)
            })
    }, [selectedUser])
    useEffect(() => {
        return () => {
            clearSolution()
            clearSelectedUser()
        }
    }, [])

    // TODO: костыль с количеством строк
    return (
        <Grid templateColumns='repeat(4, 2fr)' gap={4}>
            <GridItem colSpan={4}>
                <Heading mb={2}>{task?.name}</Heading>
                <>
                    <Button
                        onClick={() => onOpen()}
                        key={"lg"}
                        mb={4}
                    >{`Условие задачи`}</Button>
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
                                {task?.name}
                            </DrawerHeader>
                            <DrawerBody>
                                <Text fontSize="lg">{task?.description}</Text>
                                <br/>
                                {task?.attachments && task?.attachments.length > 0 && (
                                    <Heading>Вложения</Heading>
                                )}
                                {task?.attachments?.map((v, index) => (
                                    <TaskAttachment key={index} {...v} />
                                ))}
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
                </>
            </GridItem>
            <GridItem colSpan={groupRole === IGroupRole.STUDENT ? 3 : 2}>
                {current_solution && task &&
                    <TaskInfo
                        status={current_solution.status}
                        points={current_solution.score}
                        maxPoints={task.max_score}
                        date={current_solution.time_start}
                        code={current_solution.code}
                        groupRole={groupRole!}
                    />
                }
            </GridItem>
            <GridItem colSpan={1}>
                {groupRole === IGroupRole.STUDENT &&
                    <div>
                        <Button onClick={async () => {
                            await SolutionService.postSolutionCode(groupId!, courseId!, lessonId!, taskId!, current_solution!.code)
                        }}
                                mb={2}
                                width={"100%"}
                                isDisabled={!solutionIsChanged}
                        >
                            Отправить решение
                            <Icon
                                as={BiSend}
                                textAlign="center"
                                w="6"
                                h="6"
                            />
                        </Button>
                        <Button onClick={sendFileFromDialog}
                                mb={2}
                                width={"100%"}
                        >
                            Прикрепить решение
                            <Icon
                                as={GoFileCode}
                                textAlign="center"
                                w="6"
                                h="6"
                            />
                        </Button>
                    </div>
                }
                <BorderShadowBox>
                    <Tabs isFitted variant='enclosed' border={"menu"}>
                        <TabList mb='1em'>
                            <Tab>Чат</Tab>
                            <Tab>Решения</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                {/*<Chat/>*/}
                            </TabPanel>
                            <TabPanel>
                                <Flex maxH="60vh" direction="column" overflowY={"scroll"} width={"100%"} mb={2}
                                      overflow={"auto"} sx={{
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
                                }}>
                                    {solutions.length > 0
                                        ?
                                        solutions.map((solution, index) => {
                                            return <SolutionInfo {...solution} key={index}/>
                                        })
                                        :
                                        <Center>
                                            <Text>Решений нет</Text>
                                        </Center>
                                    }
                                </Flex>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </BorderShadowBox>


            </GridItem>
            {(groupRole !== IGroupRole.STUDENT) && groupRole &&
                <GridItem colSpan={1}>
                    <TaskStudentsList/>
                </GridItem>
            }
        </Grid>
);
}
