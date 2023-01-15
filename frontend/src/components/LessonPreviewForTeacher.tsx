import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import {HStack, IconButton, Progress, Spacer, Text, VStack} from '@chakra-ui/react';
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/all';
import {ILessonPreview} from "../models/ILessonPreview";
import {ITaskCountForTeacherResponse} from "../models/ITaskCountForTeacherResponse";
import {BorderShadowBox} from "./BorderShadowBox";
import {LessonPreviewTaskInfoForStudent} from "./LessonPreviewTaskInfoForStudent";
import {useMutation, useQuery} from "@apollo/client";
import GET_TASK_COUNT_FOR_TEACHER from "../request/GET_TASK_COUNT_FOR_TEACHER";

import "./LessonPreview.css";
import CHANGE_VISIBLE from "../mutation/CHANGE_VISIBLE";
import GET_LESSONS_COURSE_ROLE from "../request/GET_LESSONS_COURSE_ROLE";

export const LessonPreviewForTeacher: (props: ILessonPreview) => JSX.Element = (props: ILessonPreview) => {
    const [openTasksInfo, setOpenTasksInfo] = useState<boolean>(false)
    const [taskCountForTeacher, setTaskCountForTeacher] = useState<ITaskCountForTeacherResponse>()

    const {data: response, error} = useQuery(GET_TASK_COUNT_FOR_TEACHER,
        {variables: {"groupId": Number(props.groupId), "courseId": Number(props.courseId), "lessonId": Number(props.lessonId)}})

    if (error) {
        console.log(`Apollo error: ${error}`)
    }

    useEffect(() => {
        if (response) {
            setTaskCountForTeacher(response.get_task_count_for_teacher)
        }
    }, [response])

    const [onClickHideButton] = useMutation(CHANGE_VISIBLE, {
        refetchQueries: [
            {query: GET_LESSONS_COURSE_ROLE, variables: {"courseId": Number(props.courseId), "groupId": Number(props.courseId)}}
        ]});

    return (
        <VStack alignSelf={"left"} mb={4}>
            <BorderShadowBox padding="0.5vw" width={"100%"}>
                <HStack>
                    <HStack as={Link} to={`lesson/${props.lessonId}`} style={{width: "100%"}}>
                        <Text className={"lesson-preview__text"}>
                            {props.name}
                        </Text>
                        <Spacer/>
                        <Text>
                            Решено: {taskCountForTeacher?.students_with_all_completed_tasks}/{taskCountForTeacher?.students_count}
                        </Text>
                    </HStack>
                    {/*
                        <IconButton aria-label={"Дополнительно"}
                                    size={"lg"}
                                    bg={"transparent"}
                                    style={{backgroundColor: "transparent"}}
                                    _hover={{"background": "transparent"}}
                                    icon={!openTasksInfo ? <MdKeyboardArrowDown/> : <MdKeyboardArrowUp/>}
                                    onClick={() => {
                                        setOpenTasksInfo(!openTasksInfo)
                                    }}
                        />
                    */}
                    <IconButton aria-label={"Show/Hide Lesson"}
                                icon={props.is_hidden ? <AiOutlineEyeInvisible/> : <AiOutlineEye/>}
                                onClick={() => onClickHideButton({variables:
                                        {"groupId": Number(props.groupId),
                                        "courseId": Number(props.courseId),
                                        "lessonId": Number(props.lessonId),
                                        "isHidden": !props.is_hidden
                                        }})}
                                bg={"transparent"}
                                border={"1px"}
                                _hover={{"background": "transparent"}}
                    />
                </HStack>
                <Progress colorScheme={taskCountForTeacher ? "const_green" : "gray"}
                          w={"100%"}
                          size='lg'
                          borderRadius="lg"
                          max={taskCountForTeacher?.students_count}
                          value={taskCountForTeacher?.students_with_all_completed_tasks}
                          isAnimated={true}
                />
                {openTasksInfo &&
                    <LessonPreviewTaskInfoForStudent {...props}/>
                }
            </BorderShadowBox>
        </VStack>
    );
}