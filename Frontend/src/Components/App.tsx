import React from 'react';
import './App.css';
import { Typography } from '@mui/material';
import { ExampleComponent } from './ExampleComponent/ExampleComponent';

function App() {
	return (
		<div className="App">
			<Typography variant={'h2'}>Text to test mui component</Typography>
			<ExampleComponent variant="contained" buttonText="Hello World" />
			<ExampleComponent variant="contained" color="secondary" buttonText="Hello World" customValue="other text" />
		</div>
	);
}

export default App;
