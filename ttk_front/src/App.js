import { BrowserRouter, Routes, Route } from 'react-router-dom'

import logo from "./imgs/logo.png"

import RegForm from './components/pages/RegForm'
import LogForm from './components/pages/LogForm'
import MainPage from './components/pages/MainPage'
import TaskPage from './components/pages/TaskPage'
import ProfilePage from './components/pages/ProfilePage'

function App() {
	return (
		<div className='App'>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<MainPage />} />
					<Route path='login' element={<LogForm logo={logo} />} />
					<Route path='register' element={<RegForm logo={logo} />} />
					<Route path='tasks' element={<TaskPage />} />
					<Route path='profile' element={<ProfilePage/>}/>
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
