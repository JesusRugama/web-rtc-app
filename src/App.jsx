import './App.css'
import LocalVideo from './components/LocalVideo';
import RemoteVideo from './components/RemoteVideo';

function App() {
  return (
    <div className="App">
      <LocalVideo></LocalVideo>
      <RemoteVideo></RemoteVideo>
    </div>
  )
}

export default App
