import React from 'react';
import './App.css';
import Clarifai from 'clarifai'
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
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
			box: {},
			route: 'signin',
			isSignedIn: false
		}
	}

	// componentDidMount() {
	// 	fetch('http://localhost:3000/')
	// 	.then(resp => resp.json())
	// 	.then(console.log)
	// }

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - (clarifaiFace.right_col * width),
			bottomRow: height - (clarifaiFace.bottom_row * height)
		}
	}

	displayBox = (box) => {
		console.log(box); // need it for recognizing for multiple faces
		this.setState({box: box});
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	onButtonSubmit = () => {
		this.setState({imageURL: this.state.input})
		app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
		.then(response => this.displayBox(this.calculateFaceLocation(response)))
		.catch(err => console.log(err));
	}
	onRouteChange = (route) => {
		if(route === 'signout') {
			this.setState({isSignedIn: false});
		} else if(route === 'home') {
			this.setState({isSignedIn: true})
		}
		this.setState({route: route})
	}

	render() {
		const { isSignedIn, imageURL, route, box } = this.state
		return (
			<div className="App">
				<Particles className='particles'
				          params={particlesOptions}
				  />
				  <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
				{ route === 'home' 
					? <div> 
				      	<Logo />
					    <Rank />
					    <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
					    <FaceRecognition box = {box} imageURL={imageURL} /> 
				    </div>
				    : route === 'signin'
				    ? <SignIn onRouteChange={this.onRouteChange}/>
				  	: <Register onRouteChange={this.onRouteChange} />
					}
			</div>
		);
	}
}

export default App;
