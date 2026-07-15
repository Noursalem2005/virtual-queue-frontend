export const playDing = () => {
  try {
    const audio = new Audio('/sounds/ding.mp3')
    audio.volume = 0.4
    void audio.play()
  } catch {
    // browser blocked autoplay - ignore
  }
}
