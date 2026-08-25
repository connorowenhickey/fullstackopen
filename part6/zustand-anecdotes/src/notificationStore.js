import { create } from 'zustand'

const useNotificationStore = create(set => ({
  notification: null,

  setNotification: message => {
    set({ notification: message })

    setTimeout(() => {
      set({ notification: null })
    }, 5000)
  }
}))

export const useNotification = () =>
  useNotificationStore(state => state.notification)

export const useNotificationActions = () =>
  useNotificationStore(state => state.setNotification)