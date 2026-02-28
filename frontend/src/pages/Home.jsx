import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { isLoggedIn, username, handleLogout } = useAuth();

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h2>Hi, {username}. Thanks for loggin in!</h2>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <h2>Please Login</h2>
      )}
    </div>
  )
}