import React from 'react'
import ReactDOM from 'react-dom/client'
import './3d'
import { App } from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('ui') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
