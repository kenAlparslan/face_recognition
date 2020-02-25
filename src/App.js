import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
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

const initialState = {
	input: '',
	imageURL: '',
	box: {},
	route: 'signin',
	isSignedIn: false,
	user: {
		id: '',
		name: '',
		email: '',
		entries: 0,
		joined: ''
	}
}
class App extends React.Component {
	constructor() {
		super();
		this.state = initialState;
	}

	// componentDidMount() {
	// 	fetch('http://localhost:3000/')
	// 	.then(resp => resp.json())
	// 	.then(console.log)
	// }

	loadUser = (data) => {
		this.setState({user: {
			id: data.id,
			name: data.name,
			email: data.email,
			entries: data.entries,
			joined: data.joined,
			
		}})
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - (clarifaiFace.right_col * width),
			bottomRow: (height - (clarifaiFace.bottom_row * height))+5
		}
	}

	displayBox = (box) => {
		//console.log(box); // need it for recognizing for multiple faces
		this.setState({box: box});
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	onPictureSubmit = () => {
		this.setState({imageURL: this.state.input})
		fetch(' https://tranquil-journey-73190.herokuapp.com/imageurl', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
				input: this.state.input
			})
		})
		.then(resp => resp.json())
		.then(response => {
			if(response)
			{
				fetch(' https://tranquil-journey-73190.herokuapp.com/image', {
					method: 'put',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({
						id: this.state.user.id
					})
				})
				.then(resp => resp.json())
				.then(count => {
					this.setState(Object.assign(this.state.user, {entries: count}))
				}).catch(err => {
					console.log('Failed to return the image');
				})
			}
			this.displayBox(this.calculateFaceLocation(response))
		})
		.catch(err => console.log(err));
	}
	onRouteChange = (route) => {
		if(route === 'signout') {
			this.setState(initialState);
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
					    <Rank name={this.state.user.name} entries={this.state.user.entries} />
					    <ImageLinkForm onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit} />
					    <FaceRecognition box = {box} imageURL={imageURL} /> 
				    </div>
				    : route === 'signin'
				    ? <SignIn loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/>
				  	: <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
					}
			</div>
		);
	}
}

export default App;
