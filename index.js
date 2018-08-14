import store from 'store/dist/store.modern.js'
import expirePlugin from 'store/plugins/expire'
import qs from 'querystringify'
import { throttle } from 'throttle-debounce'
import addMonths from 'date-fns/add_months'

store.addPlugin(expirePlugin)

const PADDING = 10
class Yeet {
  constructor () {
    this.hasBeenReset = !store.get(this.key)
  }
  get isInterrupted () {
    return document.querySelector('.html5-video-player.ad-interrupting') !== null
  }
  get key () {
    const hash = qs.parse(window.location.search).v
    return `yeet-${hash}`
  }
  get video () {
    return document.querySelector('video.html5-main-video')
  }
  resetTime () {
    const { video, key } = this
    const startTime = store.get(key)
    video.currentTime = startTime
  }
  onTimeUpdate () {
    const { video, key, isInterrupted } = this
    if (isInterrupted) return false
    const { currentTime, duration } = video
    console.log(currentTime)
    if (PADDING <= currentTime && currentTime <= (duration - PADDING)) {
      console.log('set')
      store.set(key, currentTime, addMonths(new Date(), 1))
    } else if (store.get(key)) {
      console.log('rm')
      store.remove(key)
    } else {
      console.log('huh')
    }
  }
  watchTimeUpdate () {
    console.log('watching ontimeupdate')
    const fn = throttle(1000, () => { this.onTimeUpdate() })
    const params = ['timeupdate', fn]
    const video = this.video
    video.addEventListener(...params)
    this.unwatchTimeUpdate = () => {
      console.log('removing ontimeupdate')
      video.removeEventListener(...params)
      this.unwatchTimeUpdate = undefined
    }
  }
  onPlay () {
    if (!this.isInterrupted && !this.hasBeenReset) {
      console.log('resetting time')
      this.resetTime()
      this.hasBeenReset = true
    }
    if (this.isInterrupted && this.unwatchTimeUpdate) {
      this.unwatchTimeUpdate()
    } else if (!this.isInterrupted && !this.unwatchTimeUpdate) {
      this.watchTimeUpdate()
    }
  }
  watchPlay () {
    console.log('watching onplay')
    const fn = () => { this.onPlay() }
    const params = ['play', fn]
    const video = this.video
    video.addEventListener(...params)
    this.unwatchPlay = () => {
      console.log('removing onplay')
      video.removeEventListener(...params)
      this.unwatchPlay = undefined
    }
  }
}

window.yeet = new Yeet()
window.yeet.watchPlay()
