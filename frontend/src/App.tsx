import heartShapedPadlock from './assets/heart-shaped-padlock.svg'
import './App.css'

function App() {

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heartShapedPadlock} className="base heart-shaped-padlock" alt="heart-shaped-padlock" />
        </div>
        <div>
          <h1>Keen Key-in</h1>
        </div>
      </section>

      <section id="next-steps">
        <div id="docs">
          <h2>What is Keen Key-in?</h2>
          <p>More information about our password manager.</p>
          {/*  */}
        </div>
        <div id="social">
          <h2>Explore our plans.</h2>
          <p>Pricing is based on the number of secrets you keep.</p>
          {/*  */}
        </div>
      </section>

      <section id="spacer"></section>
    </>
  )
}

export default App
