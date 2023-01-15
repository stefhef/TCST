import React, {FunctionComponent, useEffect, useState} from 'react';
import {Heading, SimpleGrid, useMediaQuery} from "@chakra-ui/react";
import {BaseSpinner} from "../components/BaseSpinner";
import {CoursePreview} from "../components/CoursePreview";
import {Layout} from "../components/layouts/Layout";
import {ICoursePreview} from "../models/ICoursePreview";
import {IHomePageData} from "../models/IHomePageData";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useQuery} from "@apollo/client";
import ALL_COURSE from "../request/GET_ALL_COURSE";

const HomePage: FunctionComponent = () => {
    const [coursePreviews, setCoursePreviews] = useState<ICoursePreview[]>([])
    const [isLargerThan768] = useMediaQuery('(min-width: 768px)')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {isAuth} = useTypedSelector(state => state.auth)

    const {error, data, loading} = useQuery(ALL_COURSE)

    if (error) {
        console.log(`Apollo error: ${error}`);
    }

    useEffect(() => {
        if (isAuth && data) {
            const courses = data.get_all_courses.courses.map((courses: IHomePageData): ICoursePreview => {
                    return {
                        linkTo: `group/${courses.group.id}/course/${courses.course.id}`,
                        courseId: courses.course.id,
                        courseName: courses.course.name,
                        groupName: courses.group.name,
                        groupId: courses.group.id
                    }
                }
            ).flat().sort((a: ICoursePreview, b: ICoursePreview) => a.courseId - b.courseId)
            setCoursePreviews(courses)
            setIsLoading(false)
        }

    }, [loading])

    if (isLoading) {
        return <BaseSpinner/>;
    }

    if (coursePreviews.length !== 0) {
        const previews = coursePreviews.map((v, index) => (
            <CoursePreview
                {...v}
                key={index}
            />
        ));
        return isLargerThan768 ? (
            <Layout
                headerChildren={
                    <Heading>Курсы</Heading>
                }
                mainChildren={
                    <SimpleGrid columns={2} spacing={10}>
                        {previews}
                    </SimpleGrid>
                }
            />
        ) : (
            <div>
                <Heading mb={2}>Курсы</Heading>
                <SimpleGrid columns={4} spacing={10}>
                    {previews}
                </SimpleGrid>
            </div>
        );
    }
    return (
        <Layout
            headerChildren={
                <Heading>Курсы</Heading>
            }
            mainChildren={
                <Heading>Нет доступных курсов</Heading>
            }
        />
    );
}

export default HomePage;