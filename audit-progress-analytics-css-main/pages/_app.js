
import React, {useEffect} from "react"
import '../styles/styles.scss'
import {store,persistor} from "../redux"
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'

export default function MyApp({ Component, pageProps }){

  const getLayout = Component.getLayout || ((page) => page)

  useEffect(()=>{
    const style = document.getElementById('server-side-styles')

    if (style) {
      style.parentNode.removeChild(style)
    }
  });

  return (
    getLayout(
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    )
  )
}

