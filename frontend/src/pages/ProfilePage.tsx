import React, {FunctionComponent, useEffect, useState} from 'react';
import {Heading, SimpleGrid} from "@chakra-ui/react";
import {CoursePreview, BaseSpinner} from "../components";
import {ICoursePreview, IHomePageData} from "../models";
import {useQuery} from "@apollo/client";
import ALL_COURSE from "../request/GET_ALL_COURSE";

import './ProfilePage.css';


const ProfilePage: FunctionComponent = () => {
    const [coursePreviews, setCoursePreviews] = useState<ICoursePreview[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const {error, data, loading} = useQuery(ALL_COURSE)

    if (error) {
        console.log(`Apollo error: ${error}`);
    }

    useEffect(() => {
        if (data) {
            const courses = data.get_all_courses.courses.map((courses: IHomePageData): ICoursePreview => {
                    return {
                        linkTo: `group/${courses.group.id}/course/${courses.course.id}`,
                        courseId: courses.course.id,
                        courseName: courses.course.name,
                        groupName: courses.group.name,
                        groupId: courses.group.id
                    }
                }
            ).flat().sort((a: ICoursePreview, b: ICoursePreview) => a.courseId - b.courseId);
            setCoursePreviews(courses);
            setIsLoading(false);
        }

    }, [loading])

    if (isLoading) {
        return <BaseSpinner/>;
    } else {
        if (coursePreviews.length !== 0) {
            const previews = coursePreviews.map((v, index) => (
                <CoursePreview
                    {...v}
                    key={index}
                />
            ));
            return (
                <main className={'profile-page'}>
                    <Heading mb={5}>Курсы</Heading>
                    <SimpleGrid columns={4} spacing={10} >
                        {previews}
                    </SimpleGrid>
                </main>
            )
        }
        return (
            <main>
                <Heading>Нет доступных курсов</Heading>
            </main>
        );
    }
}

export default ProfilePage;