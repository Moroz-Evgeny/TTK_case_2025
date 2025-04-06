import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LogForm({ logo }) {
	const [loginForm, setLoginForm] = useState('')
	const [passwordForm, setPasswordForm] = useState('')
	const [token, setToken] = useState(localStorage.getItem('token') || '')
	const [btnStyle, setBtnStyle] = useState('btn disable')
	const [data, setData] = useState({})
	const navigate = useNavigate()
	useEffect(() => {
		if (loginForm === '' || passwordForm === '') {
			setBtnStyle('btn disable')
		} else {
			setBtnStyle('btn')
		}
	}, [loginForm, passwordForm])

	function handleLoginInput(e) {
		setLoginForm(e.target.value)
	}
	function handlePasswordInput(e) {
		setPasswordForm(e.target.value)
	}

	const handleSubmit = event => {
		event.preventDefault()
		const formData = {
			grant_type: 'password',
			username: loginForm,
			password: passwordForm,
			scope: '',
			client_id: '',
			client_secret: '',
		}

		fetch('http://31.41.155.241:8000/login', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},

			body: new URLSearchParams(formData).toString(),
		})
			.then(response => response.json())
			.then(result => {
				if (result.access_token) {
					localStorage.setItem('token', result.access_token)
					setToken(result.access_token)
					navigate('/tasks')

				}
				setData(result)
				console.log(result)
			})
			.catch(error => console.error('Ошибка запроса:', error))
	}

	return (
		<div className='loginPage'>
			<div className='loginForm'>
				<img src={logo} />
				<h1>Авторизация</h1>
				<form className='login_form' onSubmit={handleSubmit}>
					<div className='form_input'>
						<label htmlFor='input'>Логин</label>
						<div className='input'>
							<input
								type='text'
								onChange={handleLoginInput}
								value={loginForm}
								placeholder='login'
							/>
						</div>
					</div>
					<div className='form_input'>
						<label htmlFor='input'>Пароль</label>
						<input
							type='password'
							onChange={handlePasswordInput}
							value={passwordForm}
							placeholder='Пароль'
						/>
					</div>

					<button type='submit' className={btnStyle}>
						Войти
					</button>
				</form>
			</div>
		</div>
	)
}
