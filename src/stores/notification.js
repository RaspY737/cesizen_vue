import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const message = ref('')
  const type = ref('success')
  const visible = ref(false)
  let timerId = null

  function show(msg, msgType = 'success') {
    message.value = msg
    type.value = msgType
    visible.value = true
    if (timerId) clearTimeout(timerId)
    timerId = setTimeout(() => {
      visible.value = false
    }, 5000)
  }

  function hide() {
    visible.value = false
  }

  return { message, type, visible, show, hide }
})
