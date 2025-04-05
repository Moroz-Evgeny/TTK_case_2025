import React, { useState } from 'react'

export default function Arcticle({ data, closeArticle }) {
	const [article, setArticle] = useState('')
	const [content, setArticleContent] = useState('')
	const [isNumerableList, setIsNumerableList] = useState(false)
  const [articleData, setArticleData] = useState({})
  const [time, setTime] = useState()

	function handleArticleInput(e) {
		setArticle(e.target.value)
	}

	function handleArticleContentInput(e) {
		setArticleContent(e.target.value)
	}

	function ChangeNumList() {
		if (isNumerableList === false) {
			setIsNumerableList(true)
			setArticleContent(content + `\n1. `)
		} else {
			setIsNumerableList(false)
		}
	}

	function StopCreateArticle() {
		setArticle('')
		setArticleContent('')
		setIsNumerableList(false)
		closeArticle(false)
	}

	const handleKeyDown = e => {
		if (e.key === 'Enter') {
			const textarea = e.target
			const start = textarea.selectionStart
			const before = content.substring(0, start)
			const after = content.substring(start)

			const lines = before.split('\n')
			const lastLine = lines[lines.length - 1]

			const match = lastLine.match(/^(\d+)\.\s/)

			if (match && isNumerableList) {
				e.preventDefault()
				const nextNumber = parseInt(match[1]) + 1
				const insert = `\n${nextNumber}. `
				const newValue = before + insert + after

				setArticleContent(newValue)

				setTimeout(() => {
					textarea.selectionStart = textarea.selectionEnd =
						start + insert.length
				}, 0)
			}
		}
	}

  function SaveArticle () {
    setArticleData({
      title: article,
      content: content,
      image_url: '',
      updated_at: time,
      author_id: data.user_id
    })
  }

	return (
		<div>
			<button onClick={StopCreateArticle}>Закрыть</button>
			<input
				type='text'
				placeholder='Заголовок'
				value={article}
				onChange={handleArticleInput}
			/>
			<button onClick={ChangeNumList}>Список</button>
			<textarea
				value={content}
				onChange={handleArticleContentInput}
				onKeyDown={handleKeyDown}
				placeholder='Содержание'
			></textarea>
      <button onClick={SaveArticle}>Сохранить статью</button>
		</div>
	)
}
