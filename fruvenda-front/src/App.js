import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Landing, Login, Signup, Dashboard, SignupCommerce, ProductManagement, Logout, Profile, Cart, AvailableMarkets, ProductDetail, MarketPage, SearchResult } from './pages';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';


function App() {

  const value = {
    ripple: true,
  };


  return (
    <PrimeReactProvider value={value}>
      <BrowserRouter>
        <main>
          <Routes >
            <Route path='/' element={<Landing />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/signup' element={<Signup />}></Route>
            <Route path='/signup-commerce' element={<SignupCommerce />}></Route>
            <Route path='/dashboard' element={<Dashboard />}></Route>
            <Route path='/product-management' element={<ProductManagement />}></Route>
            <Route path='/logout' element={<Logout />}></Route>
            <Route path='/profile' element={<Profile />}></Route>
            <Route path='/profile/:slug' element={<Profile />}></Route>
            <Route path='/cart' element={<Cart />}></Route>
            <Route path='/markets' element={<AvailableMarkets />}></Route>
            <Route path='/markets/:slug' element={<MarketPage />}></Route>
            <Route path="/product/:product" element={<ProductDetail />}></Route>
            <Route path="/busqueda/:busqueda" element={<SearchResult />}></Route>
          </Routes>
        </main>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

export default App;
