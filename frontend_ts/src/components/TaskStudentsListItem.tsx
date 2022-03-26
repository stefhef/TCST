import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import UserService from "../services/UserService";
import {Box, Text, HStack, Image, Button, SkeletonCircle, SkeletonText, useColorMode} from "@chakra-ui/react";
import {BaseSpinner} from "./BaseSpinner";
import {IUser} from "../models/IUser";
import {useActions} from "../hooks/useActions";
import {useTypedSelector} from "../hooks/useTypedSelector";
import SolutionService from "../services/SolutionService";
import {getTaskStatusColorScheme, IStatusTaskColor} from "./TaskPreviewStudent";

interface ITaskStudentsList {
    studentId: number;
}

export const TaskStudentsListItem: (props: ITaskStudentsList) => JSX.Element = (props: ITaskStudentsList) => {
    const [user, setUser] = useState<IUser>()
    const [statusTaskColor, setStatusTaskColor] = useState<IStatusTaskColor>()
    const {courseId, groupId, lessonId, taskId} = useParams()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {fetchBestSolution} = useActions()
    const {setSelectedUser} = useActions()
    const {selectedUser} = useTypedSelector(state => state.selectedUser)
    const {colorMode} = useColorMode()
    useEffect(() => {
        async function fetchUser() {
            UserService.getUserById(props.studentId)
                .then((user) => setUser(user))
                .then(() => {
                    SolutionService.getBestSolution(groupId!, courseId!, taskId!, user!.id)
                        .then((solution) => {
                            console.log()
                            setStatusTaskColor(getTaskStatusColorScheme(solution?.status))
                        })
                })
        }
        fetchUser().then(() => setIsLoading(false))
    }, [courseId, groupId, lessonId, taskId, selectedUser])
    return (
        <Button width="100%" justifyContent="start"
                onClick={async () => {
                    await fetchBestSolution(groupId!, courseId!, taskId!, props.studentId)
                    setSelectedUser(user!)
                }}
                background={statusTaskColor?.iconColor}
                borderColor={colorMode === "light" ? "gray.700" : "gray.200"}
                borderWidth={user?.id === selectedUser?.id ? 3: undefined}
        >
            <HStack>
                <SkeletonCircle boxSize="34px" isLoaded={!isLoading}>
                    <Image
                        borderRadius="full"
                        boxSize="34px"
                        src={user?.avatar_url}
                    />
                </SkeletonCircle>
                <SkeletonText isLoaded={!isLoading}>
                    <Text>
                        {`${user?.first_name} ${user?.last_name}`}
                    </Text>
                </SkeletonText>
            </HStack>
        </Button>
    );
}
