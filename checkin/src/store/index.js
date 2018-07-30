import axios from 'axios'
import VueRouter from 'vue-router'
import Vue from 'vue'
import checkin from '../components/checkin'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      path: '/checkin',
      name: 'checkin',
      component: checkin
    }
  ]
})
const state = {
  msg: 'Select a Seat...',
  fixedPrice: 8,
  seatsList: [
    ['1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A', '9A', '10A', '11A', '12A', '13A', '14A', '15A'],
    ['1B', '2B', '3B', '4B', '5B', '6B', '7B', '8B', '9B', '10B', '11B', '12B', '13B', '14B', '15B'],
    ['1C', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', '11C', '12C', '13C', '14C', '15C'],
    ['empty-column'],
    ['1D', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', '11D', '12D', '13D', '14D', '15D'],
    ['1E', '2E', '3E', '4E', '5E', '6E', '7E', '8E', '9E', '10E', '11E', '12E', '13E', '14E', '15E'],
    ['1F', '2F', '3F', '4F', '5F', '6F', '7F', '8F', '9F', '10F', '11F', '12F', '13F', '14F', '15F']
  ],
  rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
  seatPrice: 0,
  totalPrice: 0,
  clickedButton: '',
  isActive: false,
  activeModal: false,
  user: '',
  randomNums: [],
  seat: ''
}

const getters = {}

const Methods = {
  SET_BUTTON: 'SET_BUTTON',
  SET_TOTALPRICE: 'SET_TOTALPRICE',
  SET_MSG: 'SET_MSG',
  SET_SEATPRICE: 'SET_SEATPRICE',
  SET_SEAT: 'SET_SEAT',
  SET_USER: 'SET_USER',
  SET_FIXEDPRICE: 'SET_FIXEDPRICE',
  SET_MODAL: 'SET_MODAL',
  SET_RANDOMSEAT: 'SET_RANDOMSEAT',
  SET_ACTIVITY: 'SET_ACTIVITY',
  SET_RANDOMNUMS: 'SET_RANDOMNUMS'
}

const mutations = {
  [Methods.SET_RANDOMNUMS] (state, nums) {
    state.randomNums = [nums[0], nums[1]]
  },
  [Methods.SET_BUTTON] (state, button) {
    state.clickedButton = button
  },
  [Methods.SET_TOTALPRICE] (state, totalp) {
    state.totalPrice = totalp
  },
  [Methods.SET_MSG] (state, msg) {
    state.msg = msg
  },
  [Methods.SET_SEATPRICE] (state, seatp) {
    state.seatPrice = seatp
  },
  [Methods.SET_SEAT] (state, selectedSeat) {
    state.seat = selectedSeat
  },
  [Methods.SET_USER] (state, user) {
    state.user = user
  },
  [Methods.SET_FIXEDPRICE] (state, fixedPrice) {
    state.fixedPrice = fixedPrice
  },
  [Methods.SET_MODAL] (state, status) {
    state.activeModal = status
  },
  [Methods.SET_RANDOMSEAT] (state, seat) {
    state.seat = seat
    state.fixedPrice = 0
    state.seatPrice = 0
    state.totalPrice = 0
    state.msg = 'Selected Seat:'
  },
  [Methods.SET_ACTIVITY] (state, status) {
    state.isActive = status
  }
}
const actions = {
  selectSeat ({commit}, selectedSeat) {
    commit(Methods.SET_ACTIVITY, true)
    commit(Methods.SET_BUTTON, selectedSeat)
    if (selectedSeat[1] == 'A' || selectedSeat[1] == 'I') {
      commit(Methods.SET_SEATPRICE, 10)
    }
    if (selectedSeat[1] == 'C' || selectedSeat[1] == 'D' || selectedSeat[1] == 'F' || selectedSeat[0] == 'G') {
      commit(Methods.SET_SEATPRICE, 8)
    }
    if (selectedSeat[1] == 'B' || selectedSeat[1] == 'E' || selectedSeat[1] == 'H') {
      commit(Methods.SET_SEATPRICE, 5)
    }
    if (selectedSeat[2]) {
      commit(Methods.SET_SEAT, selectedSeat[0] + '-' + selectedSeat[1] + selectedSeat[2])
    } else {
      commit(Methods.SET_SEAT, selectedSeat[0] + '-' + selectedSeat[1])
    }
    commit(Methods.SET_TOTALPRICE, state.seatPrice + state.fixedPrice)
    commit(Methods.SET_MSG, 'Selected Seat:')
    commit(Methods.SET_MODAL, true)
  },
  fetchUser ({ commit }) {
    axios.get('http://localhost:3030/user/fetch')
      .then(response => {
        this.name = response.data.name
        let user = this.name
        commit('SET_USER', user)
      })
      .catch(e => {
        this.errors.push(e)
      })
  },
  onSubmit ({ commit }, newUser) {
    axios.post('http://localhost:3030/user/add', newUser)
      .then((response) => {
        console.log(response.data)
        router.push('checkin')
        router.go('checkin')
        commit('SET_ACTIVITY', false)
      })
      .catch((error) => {
        console.log(error)
      })
  },
  randomNumbers ({ commit }) {
    let ran1 = Math.floor(Math.random() * (7 - 1 + 1)) + 1
    let ran2 = Math.floor(Math.random() * (20 - 1 + 1)) + 1
    commit(Methods.SET_RANDOMNUMS, [ran1, ran2])
  },
  randomSeat ({ commit }, randomNums) {
    let letter = state.rows[state.randomNums[0]]
    commit(Methods.SET_RANDOMSEAT, letter + '-' + state.randomNums[1])
    this.disablebutton = true
  },
  changeData ({ commit }, data) {
    commit('SET_ACTIVITY', data.isActive)
    commit('SET_SEATPRICE', data.seatPrice)
    commit('SET_FIXEDPRICE', data.fixedPrice)
    commit('SET_TOTALPRICE', data.totalPrice)
    commit('SET_MSG', data.msg)
    commit('SET_SEAT', data.seat)
    commit('SET_MODAL', data.activeModal)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
