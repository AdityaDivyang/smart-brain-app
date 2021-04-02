import React, { Component } from 'react';
import Particles from "react-tsparticles";
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import './App.css';

// *********The following is for the particle effects*********

const particleOptions = {
  fpsLimit: 60,
  interactivity: {
    detectsOn: "canvas",
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40,
      },
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 6,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        value_area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      random: true,
      value: 5,
    },
  },
  detectRetina: true,
}

// ******************************************************

const intitialState = {
  input: '',
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

class App extends Component {

  constructor(props) {
    super(props);
    this.particlesInit = this.particlesInit.bind(this);
    this.particlesLoaded = this.particlesLoaded.bind(this);
    this.state = intitialState;
  }

  particlesInit(main) {
    console.log(main);
  }

  particlesLoaded(container) {
    console.log(container);
  }

  calculateFaceLocation = data => {
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: data.left_col * width,
      rightCol: width - (data.right_col * width),
      topRow: data.top_row * height,
      bottomRow: height - (data.bottom_row * height)
    }
  }

  displayFaceBox = box => {
    this.setState({box: box});
  }

  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  }  

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  
  onButtonSubmit = () => {
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(
        {
          input: this.state.input
        }
      )
    })
    .then(response => response.json())
    .then(response => {
      if(response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(
            {
              id: this.state.user.id
            }
          )
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log);
      }
      this.displayFaceBox(this.calculateFaceLocation(response.outputs[0].data.regions[0].region_info.bounding_box));
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(intitialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route}) 
  }

  render() {
    const { isSignedIn, input, route, box } = this.state;
    return (
      <div className="App">
        <Particles
        id="tsparticles"
        init={this.particlesInit}
        loaded={this.particlesLoaded}
        options={particleOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box} imageUrl={input}/>
            </div>
          : (
              route === 'register'
              ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
