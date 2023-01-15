import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActions } from '../hooks';
import { BaseSpinner } from '../components';
import { sleep } from '../api/Common';

export default function RedirectPage() {
	const navigate = useNavigate();
	const params = new URLSearchParams(window.location.search);
	const code: string = params.get('code')!;
	const { login } = useActions();
	useEffect(() => {
		login(code);
		sleep(1000).then(() => navigate('/'));
	}, []);
	return <BaseSpinner />;
}
