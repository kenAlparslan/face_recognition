import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';

const particlesOptions = {
	particles: {
		number: {
			value: 150,
			density: {
				enable: true,
				value_area: 800
			}
		}
	},
	interactvity: {
		detect_on: 'window',
		events: {
			onhover: {
				enable: true,
				mode: 'repulse'
			},
			resize: true,
			modes: {
				repulse: {
					distance: 200,
					duration: 0.4
				}
			}
		}
		
	}
}

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			input: ''
		}
	}

	onInputChange = (event) => {
		console.log(event.target.value);
	}

	onButtonSubmit = () => {
		console.log('click');
	}
	render() {
	  return (
	    <div className="App">
	    <Particles className='particles'
	              params={particlesOptions}
	      />
	      <Navigation />
	      <Logo />
	      <Rank />
	      <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
	      {/*
	        <FaceRecongnition /> */}
	    </div>
	  );
	}
}

export default App;
