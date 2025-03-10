import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Login from './Pages/Login'
import Dummy from './Pages/Dummy'
import { RecoilRoot } from 'recoil'
import FeedbackPage from './Pages/FeedbackPage'

function App() {
 
  return (
    <>
    <RecoilRoot>
        <BrowserRouter>
        <Navbar/>
          <Routes>
            <Route path='/' element={<Dummy/>}></Route>
            <Route path='/Login' element={<Login/>}/>
            <Route path='/feedback' element={<FeedbackPage/>}/>
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  )
}

export default App
