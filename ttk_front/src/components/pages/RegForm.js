import React, { useEffect, useState } from 'react'

export default function RegForm() {
	
	const [nameForm, setNameForm] = useState('')
	const [lastnameForm, setSurnameForm] = useState('')
	const [middlenameForm, setMiddlenameForm] = useState('')
	const [passwordForm, setPasswordForm] = useState('')
	
	const [btnStyle, setBtnStyle] = useState('btn disable')
	const [data, setData] = useState({})
	const [isNameValid, setIsNameValid] = useState(true)
	const [isSurnameValid, setIsSurnameValid] = useState(true)
	const [isMiddlenameValid, setIsMiddlenameValid] = useState(true)
	const [loginForm, setLoginForm] = useState('')
	const [isLoginValid , setIsLoginValid] = useState(true)
	const [isValidPassword, setIsValidPassword] = useState(true)
	const [repeatPasswordForm, setRepeatPasswordForm] = useState('')

	useEffect(() => {
		if ( loginForm === '' ||
			nameForm === '' ||
			!/^[A-Za-z]+$/.test(nameForm) ||
			lastnameForm === '' ||
			!/^[A-Za-z]+$/.test(middlenameForm) ||
			!/^[A-Za-z]+$/.test(lastnameForm) ||
			passwordForm === '' || 
			repeatPasswordForm === '' 
		) {
			setBtnStyle('btn disable')
		} else {
			setBtnStyle('btn')
		}
		if (/\d/.test(nameForm)) {
			setIsNameValid(false)
			setBtnStyle('btn disable')
		} else {
			setIsNameValid(true)
		}

		if (repeatPasswordForm !== passwordForm && (repeatPasswordForm !== '' && passwordForm !== '')) {
			setBtnStyle('btn disable')
			setIsValidPassword(false)
		}
		else {
			setIsValidPassword(true)
		}

		if (/\d/.test(lastnameForm)) {
			setIsSurnameValid(false)
			setBtnStyle('btn disable')
		} else {
			setIsSurnameValid(true)
		}
		if (/\d/.test(middlenameForm)) {
			setIsMiddlenameValid(false)
			setBtnStyle('btn disable')
		} else {
			setIsMiddlenameValid(true)
		}
	}, [nameForm, lastnameForm, middlenameForm, loginForm, passwordForm, repeatPasswordForm])

	function handleNameInput(e) {
		setNameForm(e.target.value)
	}
	function handleRepeatPasswordInput (e) {
		setRepeatPasswordForm(e.target.value)
	}
	function handleSurNameInput(e) {
		setSurnameForm(e.target.value)
	}
	function handleLoginInput (e) {
		setLoginForm(e.target.value)
	}
	function handlePasswordInput(e) {
		setPasswordForm(e.target.value)
	}

	function handleMiddleNameInput(e) {
		setMiddlenameForm(e.target.value)
	}

	const handleSubmit = event => {
		event.preventDefault()
		const formData = {
			first_name: nameForm,
			middle_name: middlenameForm, 
			last_name: lastnameForm,
			password: passwordForm
		}

		fetch('localhost:8000/user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		})
			.then(response => response.json())
			.then(result => {
				console.log(result)
				setData(result)
			})
			.catch(error => console.error('Ошибка запроса:', error))
	}

	return (
		<form className='register_form' onSubmit={handleSubmit}>
			<div className='form_input'>
				<label htmlFor='input'>Логин</label>
				<div className='input'>
					<input
						type='text'
						onChange={handleLoginInput}
						value={loginForm}
						placeholder='Введите логин'
					/>
					<label className='label' htmlFor='input'>
						{isLoginValid ? '' : 'Логин введен некорректно'}
					</label>
				</div>
			</div>
			<div className='form_input'>
				<label htmlFor='input'>Имя</label>
				<div className='input'>
					<input
						type='text'
						onChange={handleNameInput}
						value={nameForm}
						placeholder='Введите имя'
					/>
					<label className='label' htmlFor='input'>
						{isNameValid ? '' : 'Имя введено некорректно'}
					</label>
				</div>
			</div>
			<div className='form_input'>
				<label htmlFor='input'>Фамилия</label>
				<div className='input'>
					<input
						type='text'
						onChange={handleSurNameInput}
						value={lastnameForm}
						placeholder='Введите фамилию'
					/>
					<label className='label' htmlFor='input'>
						{isSurnameValid ? '' : 'Фамилия введена некорректно'}
					</label>
				</div>
			</div>
			<div className='form_input'>
				<label htmlFor='input'>Отчество</label>
				<div className='input'>
					<input
						type='text'
						onChange={handleMiddleNameInput}
						value={middlenameForm}
						placeholder='Введите отчество'
					/>
					<label className='label' htmlFor='input'>
						{isMiddlenameValid ? '' : 'Отчество введено некорректно'}
					</label>
				</div>
			</div>
			<div className='form_input'>
				<label htmlFor='input'>Пароль</label>
				<input
					type='password'
					onChange={handlePasswordInput}
					value={passwordForm}
					placeholder='Введите пароль'
				/>
			</div>
			<div className='form_input'>
				<label htmlFor='input'>Повтор Пароля</label>
				<input
					type='password'
					onChange={handleRepeatPasswordInput}
					value={repeatPasswordForm}
					placeholder='Введите повтор пароля'
				/>
				<label htmlFor='input' className='label'>{isValidPassword ? '' : 'Пароли не совпадают'}</label>
			</div>
			<button type='submit' className={btnStyle}>
				Зарегистрироваться
			</button>
		</form>
	)
}
