import { useContext, useEffect } from 'react';
import Router from './routes/Router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocalStorageEventTarget } from './utils/auth';
import { AppContext } from './contexts/app.context';


function App() {
  const { setProfile, setIsAuthenticated } = useContext(AppContext)
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', () => {
      setIsAuthenticated(false)
      setProfile(null)
    })
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', () => {
        setIsAuthenticated(false)
        setProfile(null)
      })
    }
  }, [setIsAuthenticated, setProfile])

  return (
    <>
      <Router />
      <ToastContainer />
    </>
  )
}

export default App
