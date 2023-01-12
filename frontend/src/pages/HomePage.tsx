import React, {FunctionComponent, useEffect, useState} from 'react';
import {Heading, SimpleGrid, useMediaQuery} from "@chakra-ui/react";
import {BaseSpinner} from "../components/BaseSpinner";
import {CoursePreview} from "../components/CoursePreview";
import {ICoursePreview} from "../models/ICoursePreview";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {Layout} from "../components/layouts/Layout";
import {gql, useQuery} from "@apollo/client";
import {IHomePageData} from "../models/IHomePageData";

const HomePage: FunctionComponent = () => {
    const [coursePreviews, setCoursePreviews] = useState<ICoursePreview[]>([])
    const [isLargerThan768] = useMediaQuery('(min-width: 768px)')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {isAuth} = useTypedSelector(state => state.auth)


    const HOME_PAGE = gql`query HomePage {
get_all_courses {
    courses {
      course{
        id,
        name,
        description
      }
      group {
        id, 
        name
      }
      }
    }
  }`

    const {error, data} = useQuery(HOME_PAGE)

    console.log(`Data: ${data}`)

    useEffect(() => {
        async function fetchCourses() {
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
        }

        if (isAuth && data) {
            fetchCourses()
                .then(() => setIsLoading(false))
        }

    }, [data])

    if (error) {
        console.log(`Apollo error: ${error}`);
    }

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