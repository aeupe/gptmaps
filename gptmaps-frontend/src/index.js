import React, { lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { CssBaseline } from '@mui/material'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Loading from './views/Loading'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { api } from './redux/api'
import settingsReducer from './redux/settings-slice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    settings: settingsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      api.middleware
    ),
})

setupListeners(store.dispatch)

window.store = store

const MainView = lazy(() => import("./views/Main"));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <CssBaseline />
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/" component={MainView}/>
        </Switch>
      </Suspense>
    </BrowserRouter>  
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
