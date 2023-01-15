import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/all';
import {
	HStack,
	IconButton,
	Progress,
	Spacer,
	Text,
	VStack,
} from '@chakra-ui/react';
import { ILessonPreview, ITaskCountForStudentResponse } from '../models';
import { BorderShadowBox, LessonPreviewTaskInfoForStudent } from './index';
import { useQuery } from '@apollo/client';
import GET_TASK_COUNT from '../request/GET_TASK_COUNT';

import './LessonPreview.css';

export const LessonPreviewForStudent: (props: ILessonPreview) => JSX.Element = (
	props: ILessonPreview
) => {
	const [openTasksInfo, setOpenTasksInfo] = useState<boolean>(false);
	const [taskCountForStudent, setTaskCountForStudent] =
		useState<ITaskCountForStudentResponse>();

	const { data, error } = useQuery(GET_TASK_COUNT, {
		variables: {
			groupId: Number(props.groupId),
			courseId: Number(props.groupId),
			lessonId: Number(props.lessonId),
		},
	});

	if (error) {
		console.log(`Apollo error: ${error}`);
	}

	useEffect(() => {
		if (data) {
			setTaskCountForStudent(data.get_task_count);
		}
	}, [data]);
	return (
		<VStack alignSelf={'left'} mb={4}>
			<BorderShadowBox padding="0.5vw" width={'100%'}>
				<HStack>
					<HStack
						as={Link}
						to={`lesson/${props.lessonId}`}
						style={{ width: '100%' }}
					>
						<Text className={'lesson-preview__text'}>{props.name}</Text>
						<Spacer />
						<Text>
							Решено: {taskCountForStudent?.tasks_complete_count}/
							{taskCountForStudent?.tasks_count}
						</Text>
					</HStack>
					<IconButton
						aria-label={'Дополнительно'}
						size={'lg'}
						bg={'transparent'}
						style={{ backgroundColor: 'transparent' }}
						_hover={{ background: 'transparent' }}
						icon={
							!openTasksInfo ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />
						}
						onClick={() => {
							setOpenTasksInfo(!openTasksInfo);
						}}
					/>
				</HStack>
				<Progress
					colorScheme={taskCountForStudent ? 'const_green' : 'gray'}
					w={'100%'}
					size="lg"
					borderRadius="lg"
					max={taskCountForStudent?.tasks_count}
					value={taskCountForStudent?.tasks_complete_count}
					isAnimated={true}
				/>
				{openTasksInfo && <LessonPreviewTaskInfoForStudent {...props} />}
			</BorderShadowBox>
		</VStack>
	);
};
