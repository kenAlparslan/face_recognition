import React from 'react';
import './App.css';
import Clarifai from 'clarifai'
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';

const app = new Clarifai.App({
 apiKey: '4bed7e7449134169a9b3119416ba66dd'
});


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
			input: '',
			imageURL: '',
			box: {}
		}
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - (clarifaiFace.rightCol * width),
			bottomRow: height - (clarifaiFace * height)
		}
	}

	displayFaceBox = 

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	onButtonSubmit = () => {
		this.setState({imageURL: this.state.input})
		app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
		.then(response => this.calculateFaceLocation(response))
		.catch(err => console.log(err));
  		
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
	      <FaceRecognition imageURL={this.state.imageURL} /> 
	    </div>
	  );
	}
}

export default App;
