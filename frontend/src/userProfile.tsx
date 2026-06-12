import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GETUser } from './APICalls/GETUser'
import { PUTUser } from './APICalls/PUTUser'
import type { UserProfile } from './types/User'
import {
  clearUser,
  getStoredUser,
  normalizeUser,
  saveUser,
} from './userSession'
import './App.css'
import './userProfile.css'

function formatDateForInput(dateValue: string): string {
  return new Date(dateValue).toISOString().slice(0, 10)
}

function formatDateForDisplay(dateValue: string): string {
  return new Date(dateValue).toLocaleDateString()
}

function UserProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [draft, setDraft] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    const storedUser = getStoredUser()

    if (!storedUser) {
      navigate('/')
      return
    }

    const loadUser = async () => {
      try {
        const response = await GETUser(storedUser.id)
        const data = await response.json()

        if (data.error || !data.user) {
          setError(data.error ?? 'Unable to load profile.')
          return
        }

        const profile = normalizeUser(data.user)
        setUser(profile)
        setDraft(profile)
        saveUser(profile)
      } catch {
        setError('Unable to reach the server.')
      }
    }

    void loadUser()
  }, [navigate])

  const startEditing = () => {
    if (!user) {
      return
    }

    setDraft({ ...user })
    setIsEditing(true)
    setError('')
    setStatusMessage('')
  }

  const cancelEditing = () => {
    setDraft(user ? { ...user } : null)
    setIsEditing(false)
    setError('')
  }

  const handleSave = async () => {
    if (!user || !draft) {
      return
    }

    setError('')
    setStatusMessage('')

    try {
      const response = await PUTUser(user.id, {
        first_name: draft.first_name,
        last_name: draft.last_name,
        email: draft.email,
        date_of_birth: `${formatDateForInput(draft.date_of_birth)} 00:00:00`,
        active: draft.active,
      })
      const data = await response.json()

      if (data.error || !data.user) {
        setError(data.error ?? 'Unable to update profile.')
        return
      }

      const updatedUser = normalizeUser(data.user)
      setUser(updatedUser)
      setDraft(updatedUser)
      saveUser(updatedUser)
      setIsEditing(false)
      setStatusMessage('Profile updated successfully.')
    } catch {
      setError('Unable to reach the server.')
    }
  }

  const handleLogout = () => {
    clearUser()
    navigate('/')
  }

  if (!user || !draft) {
    return (
      <section className="profile-page">
        <p>{error || 'Loading profile...'}</p>
      </section>
    )
  }

  return (
    <section className="profile-page">
      <div className="profile-header">
        <h1>Your profile</h1>
        <div className="profile-actions">
          <Link to="/" className="auth-button auth-button-secondary">
            Home
          </Link>
          <button
            type="button"
            className="auth-button auth-button-secondary"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>

      {statusMessage && <p className="profile-status">{statusMessage}</p>}
      {error && <p className="form-error">{error}</p>}

      <div className="profile-card">
        <div className="profile-field">
          <span>First name</span>
          {isEditing ? (
            <input
              type="text"
              value={draft.first_name}
              onChange={(e) =>
                setDraft({ ...draft, first_name: e.target.value })
              }
            />
          ) : (
            <p className="profile-value">{user.first_name || '—'}</p>
          )}
        </div>

        <div className="profile-field">
          <span>Last name</span>
          {isEditing ? (
            <input
              type="text"
              value={draft.last_name}
              onChange={(e) =>
                setDraft({ ...draft, last_name: e.target.value })
              }
            />
          ) : (
            <p className="profile-value">{user.last_name || '—'}</p>
          )}
        </div>

        <div className="profile-field">
          <span>Email</span>
          {isEditing ? (
            <input
              type="email"
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            />
          ) : (
            <p className="profile-value">{user.email}</p>
          )}
        </div>

        <div className="profile-field">
          <span>Date of birth</span>
          {isEditing ? (
            <input
              type="date"
              value={formatDateForInput(draft.date_of_birth)}
              onChange={(e) =>
                setDraft({ ...draft, date_of_birth: e.target.value })
              }
            />
          ) : (
            <p className="profile-value">
              {formatDateForDisplay(user.date_of_birth)}
            </p>
          )}
        </div>

        <div className="profile-field">
          <span>Active</span>
          {isEditing ? (
            <label className="profile-checkbox">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) =>
                  setDraft({ ...draft, active: e.target.checked })
                }
              />
              Account is active
            </label>
          ) : (
            <p className="profile-value">{user.active ? 'Yes' : 'No'}</p>
          )}
        </div>
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <>
            <button
              type="button"
              className="auth-button auth-button-primary"
              onClick={() => void handleSave()}
            >
              Save changes
            </button>
            <button
              type="button"
              className="auth-button auth-button-secondary"
              onClick={cancelEditing}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            className="auth-button auth-button-primary"
            onClick={startEditing}
          >
            Edit profile
          </button>
        )}
      </div>
    </section>
  )
}

export default UserProfilePage
