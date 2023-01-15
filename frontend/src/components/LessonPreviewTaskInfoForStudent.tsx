import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
	Divider,
	HStack,
	Icon,
	Skeleton,
	Spacer,
	Text,
} from '@chakra-ui/react';
import { ILessonPreview, ILessonStat } from '../models';

import StatService from '../services/StatService';
import { getTaskStatusColorScheme } from '../common/colors';
import { BaseSpinner, ShadowBox } from './index';

export const LessonPreviewTaskInfoForStudent: (
	props: ILessonPreview
) => JSX.Element = (props: ILessonPreview) => {
	const [state, setState] = useState<ILessonStat>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	useEffect(() => {
		StatService.getLessonStat(
			props.groupId,
			props.courseId,
			props.lessonId
		).then((lesson_stat) => {
			setState(lesson_stat);
		});
		setIsLoading(false);
	}, [isLoading]);
	if (isLoading) {
		return <BaseSpinner />;
	}
	return (
		<>
			{state ? (
				state.tasks.map((task, i) => {
					return (
						<ShadowBox key={i}>
							<HStack
								as={Link}
								to={`lesson/${props.lessonId}/task/${task.id}`}
								alignItems={'center'}
								ml={2}
							>
								<Icon
									as={getTaskStatusColorScheme(task.status).icon}
									color={getTaskStatusColorScheme(task.status).iconColor}
									display={'flex'}
									w="4"
									h="4"
								/>
								<Text>{task.name}</Text>
								<Spacer />
								<Text>
									{task.best_score} / {task.max_score}
								</Text>
							</HStack>
							{i !== state.tasks.length - 1 && <Divider />}
						</ShadowBox>
					);
				})
			) : (
				<Skeleton></Skeleton>
			)}
		</>
	);
};
