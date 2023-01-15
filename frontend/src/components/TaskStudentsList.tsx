import React, { useEffect, useState} from "react";
import {useParams} from "react-router";
import {Heading, VStack} from "@chakra-ui/react";
import {BaseSpinner, TaskStudentsListItem} from "./index";
import UserService from "../services/UserService";
import {BorderShadowBox} from "./BorderShadowBox";
import {useActions, useTypedSelector} from "../hooks";
import {IUser} from "../models";


export const TaskStudentsList: () => JSX.Element = () => {
    const [students, setStudents] = useState<IUser[]>()
    const {courseId, groupId, lessonId, taskId} = useParams()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {setSelectedUser, setSolution} = useActions()
    const {current_solution} = useTypedSelector(state => state.solution)
    useEffect(() => {
        UserService.getStudentsGroup(groupId!)
            .then(studs => {
                if (studs) {
                    setStudents(studs)
                }
                setIsLoading(false)
            })
    }, [courseId, groupId, lessonId, taskId])

    if (isLoading)
        return <BaseSpinner/>
    return (
        <BorderShadowBox w={"100%"}>
            <Heading size="sm" textAlign="center" paddingBottom={2}>
                Список студентов
            </Heading>
            <VStack padding={2} alignItems={"start"}>
                {students?.map((student, index) =>
                    <TaskStudentsListItem key={index} studentId={student.id} index={index}/>
                )}
            </VStack>
        </BorderShadowBox>
    );
}
