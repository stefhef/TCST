import React, {FunctionComponent, useEffect, useState} from 'react';
import {useParams} from 'react-router';

import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Heading,
    VStack,
} from '@chakra-ui/react';

import {BaseSpinner} from "../components/BaseSpinner";
import {LessonPreviewForStudent} from "../components/LessonPreviewForStudent";
import {ILessonsResponse} from "../models/ILessonsResponse";
import {ICourse} from "../models/ICourse";
import {IGroupRole} from "../models/IGroupRole";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {Layout} from "../components/layouts/Layout";
import {LessonPreviewForTeacher} from "../components/LessonPreviewForTeacher";
import {useQuery} from "@apollo/client";
import GET_LESSONS_COURSES_ROLE from '../request/GetLessonsCoursesRole';

const CoursePage: FunctionComponent = () => {



    const {groupId, courseId} = useParams();
    const [lessonsResponse, setLessonsResponse] = useState<ILessonsResponse>()
    const [course, setCourse] = useState<ICourse>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [groupRole, setGroupRole] = useState<IGroupRole>()
    const {isAuth} = useTypedSelector(state => state.auth)

    const {error, data, loading} = useQuery(GET_LESSONS_COURSES_ROLE,
        {variables: {"groupId": Number(groupId), "courseId": Number(courseId)}})

    if (error) {
        console.log(`Apollo error: ${error}`);
    }

    useEffect(() => {
        async function fetchLessons() {
            setLessonsResponse(data.get_lessons)
            setCourse(data.get_courses)
            setGroupRole(data.get_role)
        }

        if (isAuth && data) {
            fetchLessons()
                .then(() => setIsLoading(false))
        }
    }, [loading]);

    if (isLoading)
        return <BaseSpinner/>;
    return (
        <Layout
            headerChildren={
                <VStack alignItems={"flex"}>
                    <Accordion allowMultiple>
                        <AccordionItem borderBottom="none" borderTop="none">
                            <AccordionButton borderWidth="1px" borderRadius="lg" padding="1vw">
                                <Box flex="1" textAlign="left">
                                    <Heading>{course?.name}</Heading>
                                </Box>
                                <AccordionIcon/>
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                {course?.description}
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                    <Heading padding="1vw">Уроки</Heading>
                </VStack>
            }
            mainChildren={
                <>

                    {lessonsResponse && (groupRole === IGroupRole.STUDENT ?
                        lessonsResponse.lessons.map((v) => (
                            <LessonPreviewForStudent
                                groupId={groupId!}
                                lessonId={v.id}
                                name={v.name}
                                courseId={courseId!}
                                groupRole={groupRole!}
                                key={v.id}
                            />
                        ))
                        :
                        lessonsResponse.lessons.map((v) => (
                            <LessonPreviewForTeacher
                                groupId={groupId!}
                                lessonId={v.id}
                                name={v.name}
                                courseId={courseId!}
                                groupRole={groupRole!}
                                is_hidden={v.is_hidden}
                                key={v.id}
                            />
                        )))}
                </>
            }
        />
    );
}

export default CoursePage