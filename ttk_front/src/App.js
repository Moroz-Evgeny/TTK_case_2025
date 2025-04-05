import { BrowserRouter, Routes, Route } from 'react-router-dom'

import RegForm from './components/pages/RegForm'
import LogForm from './components/pages/LogForm'
import MainPage from './components/pages/MainPage'
import TaskPage from './components/pages/TaskPage'

function App() {
	return (
		<div className='App'>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<MainPage />} />	
          <Route path='login' element={<LogForm/>}/>
          <Route path='register' element={<RegForm/>}/>		
          <Route path='tasks' element={<TaskPage/>}/>		
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
