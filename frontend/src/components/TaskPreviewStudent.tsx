import {Link} from 'react-router-dom';

import {
    HStack,
    Icon,
    Progress,
    SkeletonCircle,
    SkeletonText,
    Spacer,
    Text,
    VStack
} from '@chakra-ui/react';
import {BorderShadowBox} from "./BorderShadowBox";
import {ITaskPreviewStudent} from '../models/ITaskPreviewStudent';
import {useEffect, useState} from "react";
import {ISolution} from '../models/ISolution';
import {useParams} from "react-router";
import {getTaskStatusColorScheme} from '../common/colors';
import {IStatusTaskColor} from "../models/IStatusTaskColor";
import {useQuery} from "@apollo/client";
import GET_SOLUTION_BEST from "../request/GetSolutionBest";


export const TaskPreviewStudent: (props: ITaskPreviewStudent) => JSX.Element = (props: ITaskPreviewStudent) => {
    const [solution, setSolution] = useState<ISolution | null>()
    const [status, setStatus] = useState<IStatusTaskColor>()
    const {groupId, courseId, lessonId} = useParams()
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    const {data, loading, error} = useQuery(GET_SOLUTION_BEST,
        {variables: {"courseId": Number(courseId), "groupId": Number(groupId), "taskId": props.taskId}})

    if (error) {
        console.log(`Apollo error: ${error}`);
    }

    useEffect(() => {
        async function fetchSolution() {
            setSolution(data.get_solution_best)
            setStatus(getTaskStatusColorScheme(solution?.status))
        }

        if (data) {
            fetchSolution().then(() => setIsLoaded(true))
        }
    }, [loading])

    return (
        <Link to={`task/${props.taskId}`}>
            <BorderShadowBox padding="0.5vw" mb="5px">
                <VStack alignItems={"left"}>
                    <HStack>
                        <HStack>
                            <SkeletonCircle size="6" isLoaded={Boolean(isLoaded)}>
                                <Icon
                                    as={status?.icon}
                                    color={status?.iconColor}
                                    textAlign="center"
                                    w="6"
                                    h="6"
                                />
                            </SkeletonCircle>
                            <Text fontSize="2xl">{props.taskName}</Text>
                        </HStack>
                        <Spacer/>
                        <SkeletonText isLoaded={Boolean(isLoaded)}
                                      noOfLines={1}>
                            <Text
                                align="right"
                            >
                                {`${solution?.score || 0}/${props.taskMaxScore}`}
                            </Text>
                        </SkeletonText>
                        <SkeletonText isLoaded={Boolean(isLoaded)}
                                      noOfLines={1}>
                            <Text
                                align="right"
                                color={status?.iconColor}
                            >
                                {`${status?.textStatus}`}
                            </Text>
                        </SkeletonText>
                    </HStack>
                    <Progress colorScheme={status ? status.progressColor : "gray"}
                              w={"100%"}
                              size='lg'
                              borderRadius="lg"
                              value={(solution?.score || 0) / props.taskMaxScore * 100}
                              isIndeterminate={!isLoaded}
                              isAnimated={true}
                    />
                </VStack>
            </BorderShadowBox>
        </Link>
    );
}