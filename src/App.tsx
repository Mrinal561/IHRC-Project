// import { Provider } from 'react-redux'
// import { BrowserRouter } from 'react-router-dom'
// import { PersistGate } from 'redux-persist/integration/react'
// import store, { persistor } from './store'
// import Theme from '@/components/template/Theme'
// import Layout from '@/components/layouts'
// import mockServer from './mock'
// import appConfig from '@/configs/app.config'
// import './locales'
// import { useEffect } from 'react'

// import { useAppDispatch } from '@/store'
// import { fetchAuthUser, setIsAuthenticated } from './store/slices/login'

// const environment = process.env.NODE_ENV
// /**
//  * Set enableMock(Default false) to true at configs/app.config.js
//  * If you wish to enable mock api
//  */
// // if (environment !== 'production' && appConfig.enableMock) {
// //     mockServer({ environment })
// // }

// function App() {
//     // const dispatch = useAppDispatch()
//     // useEffect(() => {
//     //     appInitial()
//     // }, [])

//     // const appInitial = async () => {
//     //     dispatch(fetchAuthUser()).then(({ payload }) => {
//     //         if (payload) {
//     //             dispatch(setIsAuthenticated(true))
//     //         } else {
//     //             dispatch(setIsAuthenticated(false))
//     //         }
//     //     })
//     // }

//     return (
//         <Provider store={store}>
//             <PersistGate loading={null} persistor={persistor}>
//                 <BrowserRouter>
//                     <Theme>
//                         <Layout />
//                     </Theme>
//                 </BrowserRouter>
//             </PersistGate>
//         </Provider>
//     )
// }

// export default App

import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
// import store, {
//     fetchAuthUser,
//     persistor,
//     setIsAuthenticated,
//     useAppDispatch,
// } from './store'
import { fetchAuthUser } from './store/slices/login'
import store, { persistor } from './store'
import { setIsAuthenticated } from './store/slices/login'
import { useAppDispatch } from './store'

import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
// import mockServer from './mock'
import appConfig from '@/configs/app.config'
import './locales'
import { useEffect, useState } from 'react'

const environment = process.env.NODE_ENV

/**
 * Set enableMock(Default false) to true at configs/app.config.js
 * If you wish to enable mock api
 */
// if (environment !== 'production' && appConfig.enableMock) {
//     mockServer({ environment })
// }
function App() {
    const [loading, setLoading] = useState(true)
    const dispatch = useAppDispatch()
    useEffect(() => {
        appInitial()
    }, [])

    const appInitial = async () => {
        dispatch(fetchAuthUser()).then(({ payload }) => {
            if (payload) {
                dispatch(setIsAuthenticated(true))
            } else {
                dispatch(setIsAuthenticated(false))
            }
            setLoading(false)
        })
    }

    return (
        <PersistGate loading={null} persistor={persistor}>
            {!loading && (
                <BrowserRouter basename="ihrc">
                    <Theme>
                        <Layout />
                    </Theme>
                </BrowserRouter>
            )}
        </PersistGate>
    )
}

export default App