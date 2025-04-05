import { Link } from 'react-router-dom'


import logoF from "../imgs/logo-white.png"
import inf from "../imgs/inf.svg"
import task from "../imgs/sber.svg"
import prof from "../imgs/prof.svg"

import React from 'react'

export default function Header() {
  return (
		<div className='header'>
			<div className='logo_h'>
				<img src={logoF} />
        <div className='defis'></div>
				<p> Взгляни на мир под другим углом</p>
			</div>
      <div className='links'>
        <Link className='header_btn' to="/"><img src={inf}/> <p>Информация</p></Link>
        <Link className='header_btn' to="/tasks"><img src={task}/> <p>Задача</p></Link>
        <Link className='header_btn' to="/profile"><img src={prof}/> <p>Профиль</p></Link>
      </div>
		</div>
	)
}
