import React, { useState } from 'react'

import Arcticle from '../Arcticle'
import Header from '../Header'

export default function MainPage() {
  const data = localStorage.getItem('data')
  const [createArticle, setCreateArticle] = useState(false)
  function OpenArticleCreator () {
    setCreateArticle(true)
  }
	return (
		<div>
			<Header/>
      <div>
        <button onClick={()=>{OpenArticleCreator()}}>Создать статью</button>
        <div>{createArticle ? <Arcticle data={data} closeArticle={setCreateArticle}/> : ''}</div>
      </div>
		</div>
	)
}
