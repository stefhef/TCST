import React, {FunctionComponent, useEffect, useState} from 'react';
import {useParams} from "react-router";
import {Heading, HStack, Icon, VStack, Text, Spacer, Divider} from "@chakra-ui/react";
import {ICourseStat} from "../models";
import {getTaskStatusColorScheme} from "../common/colors";
import {BorderShadowBox, BaseSpinner} from "./index";
import {useQuery} from "@apollo/client";
import GET_COURSE_STAT_FOR_STUDENT from "../request/GET_COURSE_STAT_FOR_STUDENT";

import './ProfileCourse.css'

export const ProfileCourseStatForStudent: FunctionComponent = () => {
    const {groupId, courseId} = useParams();
    const [courseStat, setCourseStat] = useState<ICourseStat>()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const {data, loading, error} = useQuery(GET_COURSE_STAT_FOR_STUDENT,
        {variables: {"groupId": Number(groupId), "courseId": Number(courseId)}})

    if (error) {
        console.log(`Apollo error: ${error}`)
    }

    useEffect(() => {
        if (data) {
            setCourseStat(data.get_course_stat_for_student)
            setIsLoading(false)
        }
    }, [data])

    if (isLoading) {
        return <BaseSpinner />
    }

    return (
        <VStack alignItems={"left"} className={'profile-course'}>
            {courseStat?.lessons.map((lesson) => {
                return (
                    <BorderShadowBox padding={3}>
                        <Heading size="md">{lesson.name}</Heading>
                        {lesson.tasks.map(((task) => {
                            return (
                                <>
                                    <HStack alignItems={"center"}>
                                        <Icon
                                            as={getTaskStatusColorScheme(task.status).icon}
                                            color={getTaskStatusColorScheme(task.status).iconColor}
                                            display={"flex"}
                                            w="4"
                                            h="4"
                                        />
                                        <Text>
                                            {task.name}
                                        </Text>
                                        <Spacer/>
                                        <Text>
                                            {task.best_score} / {task.max_score}
                                        </Text>
                                    </HStack>
                                    <Divider/>
                                </>
                            );
                        }))}
                    </BorderShadowBox>
                );
            })}
        </VStack>
    );
};
