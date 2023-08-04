import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    openAiApiKey: localStorage.getItem('openAiApiKey') || '',
    googleApiKey: localStorage.getItem('googleApiKey') || ''
}

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setSettings(state, action) {
            state.openAiApiKey = action.payload.openAiApiKey
            const previousGoogleApiKey = state.googleApiKey
            state.googleApiKey = action.payload.googleApiKey
            localStorage.setItem('openAiApiKey', action.payload.openAiApiKey)
            localStorage.setItem('googleApiKey', action.payload.googleApiKey)
            if ( previousGoogleApiKey !== action.payload.googleApiKey ) {
                window.location.reload()
            }
        }
    },
})

export const { setSettings } = settingsSlice.actions
export default settingsSlice.reducer