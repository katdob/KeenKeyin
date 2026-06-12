import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import heartShapedPadlock from './assets/heart-shaped-padlock.svg'
import { POSTLogIn } from './APICalls/POSTLogIn'
import { POSTSignup } from './APICalls/POSTSignup'
import type { UserProfile } from './types/User'
import { normalizeUser, saveUser } from './userSession'
import './App.css'

interface AuthResponse {
  error?: string
  message?: string
  user?: UserProfile
}

function App() {
  const navigate = useNavigate()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword1, setSignupPassword1] = useState('')
  const [signupPassword2, setSignupPassword2] = useState('')
  const [signupError, setSignupError] = useState('')

  const passwordsMatch =
    signupPassword1.length > 0 &&
    signupPassword1 === signupPassword2

  const closeLogin = () => {
    setIsLoginOpen(false)
    setLoginUsername('')
    setLoginPassword('')
    setLoginError('')
  }

  const closeSignup = () => {
    setIsSignupOpen(false)
    setSignupEmail('')
    setSignupPassword1('')
    setSignupPassword2('')
    setSignupError('')
  }

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoginError('')

    try {
      const response = await POSTLogIn(loginUsername, loginPassword)
      const data = (await response.json()) as AuthResponse

      if (data.error) {
        setLoginError(data.error)
        return
      }

      if (!data.user) {
        setLoginError('Unable to log in right now.')
        return
      }

      saveUser(normalizeUser(data.user))
      closeLogin()
      navigate('/user-profile')
    } catch {
      setLoginError('Unable to reach the server.')
    }
  }

  const handleSignupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSignupError('')

    try {
      const response = await POSTSignup(signupEmail, signupPassword1)
      const data = (await response.json()) as AuthResponse

      if (data.error) {
        setSignupError(data.error)
        return
      }

      if (!data.user) {
        setSignupError('Unable to sign up right now.')
        return
      }

      saveUser(normalizeUser(data.user))
      closeSignup()
      navigate('/user-profile')
    } catch {
      setSignupError('Unable to reach the server.')
    }
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heartShapedPadlock} className="base heart-shaped-padlock" alt="heart-shaped-padlock" />
        </div>
        <div>
          <h1>Keen Key-in</h1>
          <div className="auth-buttons">
            <button
              type="button"
              className="auth-button auth-button-secondary"
              onClick={() => setIsLoginOpen(true)}
            >
              Log in
            </button>
            <button
              type="button"
              className="auth-button auth-button-primary"
              onClick={() => setIsSignupOpen(true)}
            >
              Sign up
            </button>
          </div>
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

      {isSignupOpen && (
        <div
          className="modal-overlay"
          onClick={closeSignup}
          role="presentation"
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="signup-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="signup-title">Sign up</h2>
            <form className="signup-form" onSubmit={handleSignupSubmit}>
              <label className="form-field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  autoComplete="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </label>
              <label className="form-field">
                <span>Password</span>
                <input
                  type="password"
                  name="password1"
                  placeholder="********"
                  autoComplete="new-password"
                  value={signupPassword1}
                  onChange={(e) => setSignupPassword1(e.target.value)}
                />
              </label>
              <label className="form-field">
                <span>Confirm password</span>
                <input
                  type="password"
                  name="password2"
                  placeholder="********"
                  autoComplete="new-password"
                  value={signupPassword2}
                  onChange={(e) => setSignupPassword2(e.target.value)}
                />
              </label>
              {signupPassword2.length > 0 && !passwordsMatch && (
                <p className="form-error">Passwords do not match.</p>
              )}
              {signupError && (
                <p className="form-error">{signupError}</p>
              )}
              <button
                type="submit"
                className="auth-button auth-button-primary"
                disabled={!passwordsMatch}
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      )}

      {isLoginOpen && (
        <div
          className="modal-overlay"
          onClick={closeLogin}
          role="presentation"
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="login-title">Log in</h2>
            <form className="login-form" onSubmit={handleLoginSubmit}>
              <label className="form-field">
                <span>Username</span>
                <input
                  type="text"
                  name="username"
                  placeholder="email@example.com"
                  autoComplete="username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                />
              </label>
              <label className="form-field">
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  placeholder="********"
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </label>
              {loginError && (
                <p className="form-error">{loginError}</p>
              )}
              <button type="submit" className="auth-button auth-button-primary">
                Log in
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default App
