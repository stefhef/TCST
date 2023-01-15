import React, {FunctionComponent, useEffect, useState} from 'react';
import {useParams} from "react-router";
import {ProfileCourseStatForStudent, ProfileCourseStatForTeacher, Layout} from '../components';
import {IGroupRole} from "../models";
import {useQuery} from "@apollo/client";
import GET_ROLE from "../request/GET_ROLE";

const ProfileCourseStatPage: FunctionComponent = () => {
    const {groupId, courseId} = useParams()
    const [groupRole, setGroupRole] = useState<IGroupRole>()

    const {data, loading, error} = useQuery(GET_ROLE,
        {variables: {"groupId": Number(groupId)}})

    if (error) {
        console.log(`Apollo error: ${error}`)
    }

    useEffect(() => {
        if (data) {
            setGroupRole(data.get_role)
        }
    }, [loading])

    return (
        <Layout mainChildren={groupRole! === IGroupRole.TEACHER ?
            <ProfileCourseStatForTeacher/>
            :
            <ProfileCourseStatForStudent/>
        }
        />
    );

}

export default ProfileCourseStatPage;