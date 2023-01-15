import React, { FunctionComponent, useEffect, useState } from 'react';
import { useParams } from 'react-router';

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

import {
	BaseSpinner,
	Layout,
	TaskPreviewStudent,
	TaskPreviewTeacher,
} from '../components';
import { ITasksResponse, ILesson, IGroupRole, ITaskType } from '../models';
import { useQuery } from '@apollo/client';
import GET_LESSON_WITH_TASKS from '../request/GET_LESSON_WITH_TASKS';

const LessonPage: FunctionComponent = () => {
	const { groupId, courseId, lessonId } = useParams();
	const [tasksResponse, setTasksResponse] = useState<ITasksResponse>();
	const [lesson, setLesson] = useState<ILesson>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [groupRole, setGroupRole] = useState<IGroupRole>();

	const { data, error, loading } = useQuery(GET_LESSON_WITH_TASKS, {
		variables: {
			groupId: Number(groupId),
			courseId: Number(courseId),
			lessonId: Number(lessonId),
		},
	});

	if (error) {
		console.log(`Apollo error: ${error}`);
	}

	useEffect(() => {
		if (data) {
			setTasksResponse(data.get_all_tasks);
			setLesson(data.get_lesson);
			setGroupRole(data.get_role);
			setIsLoading(false);
		}
	}, [loading]);

	if (isLoading) {
		return <BaseSpinner />;
	}
	return (
		<Layout
			headerChildren={
				<VStack alignItems={'flex'}>
					<Accordion allowMultiple>
						<AccordionItem borderBottom="none" borderTop="none">
							<AccordionButton
								borderWidth="1px"
								borderRadius="lg"
								padding="1vw"
							>
								<Box flex="1" textAlign="left">
									<Heading>{lesson!.name}</Heading>
								</Box>
								<AccordionIcon />
							</AccordionButton>
							<AccordionPanel pb={4}>{lesson!.description}</AccordionPanel>
						</AccordionItem>
					</Accordion>
					<Heading padding="1vw">Задачи</Heading>
				</VStack>
			}
			mainChildren={
				<>
					{[
						['Классная работа', ITaskType.CLASS_WORK],
						['Домашняя работа', ITaskType.HOME_WORK],
						['Дополнительные задачи', ITaskType.ADDITIONAL_WORK],
					].map((elem) => {
						return (
							<>
								{tasksResponse!.tasks.filter((task) => {
									return task.task_type === elem[1];
								}).length ? (
									<>
										<Heading size={'md'} paddingBottom={4}>
											{elem[0]}
										</Heading>
										{tasksResponse!.tasks
											.filter((task) => {
												return task.task_type === elem[1];
											})
											.map((task) => {
												if (groupRole! === IGroupRole.STUDENT)
													return (
														<TaskPreviewStudent
															key={task.id}
															taskId={task.id}
															taskName={task.name}
															taskMaxScore={task.max_score}
														/>
													);
												else
													return (
														<TaskPreviewTeacher
															key={task.id}
															taskId={task.id}
															taskName={task.name}
														/>
													);
											})}
									</>
								) : (
									<></>
								)}
							</>
						);
					})}
				</>
			}
		/>
	);
};

export default LessonPage;
