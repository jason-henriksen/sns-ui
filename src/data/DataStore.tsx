
import { observable, action } from 'mobx';
import { w3cwebsocket as W3CWebSocket } from "websocket"

const server = 'https://7cht5e6rof.execute-api.us-west-2.amazonaws.com/Prod'

export class DataStore {
  @observable actorGender: string = 'F'
  @observable actorState = 'CA'
  @observable actorPhone = '1112223333'

  @observable agentName = ''
  @observable agentState = 'CA'
  @observable agentLog = []

  @observable notifyGender = 'M'
  @observable notifyState = 'CA'
  @observable notifyNote = ''

  @observable isWorking = 0;
  @observable basicReport = {};
  @observable reportYear = 2017;


  client: W3CWebSocket = new W3CWebSocket('wss://4makz5wwl5.execute-api.us-west-2.amazonaws.com/Prod') // not observable.   Used for WebSocket connections

  // Actor
  @action actorSubscribe() {
    var saneThis = this;
    saneThis.isWorking++;
    fetch(`${server}/actor/sub/${this.actorPhone}/${this.actorState}/${this.actorGender}`,
      {
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        method: "PUT",
      })
      .then(function (res) { saneThis.isWorking--; return res.json() })
      .then(function (res) { console.log(res); }) // don't forget to bind or JavaScript with drop it's brain on the floor.
      .catch(function (err) { console.log(err); })
  }

  // Agent
  @action agentSubscribe() {
    var saneThis = this;
    saneThis.isWorking++;
    fetch(`${server}/agent/${this.agentState}/${encodeURI(this.agentName)}`,
      {
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        method: "PUT",
        body: JSON.stringify({
          url: `https://7cht5e6rof.execute-api.us-west-2.amazonaws.com/Prod/webhook/${this.agentState}/${this.agentName}`
        }
        )
      })
      .then(function (res) { saneThis.isWorking--; return res.json() })
      .then(function (res) { console.log(res); }) // don't forget to bind or JavaScript with drop it's brain on the floor.
      .catch(function (err) { console.log(err); })
  }
  @action agentUnSubscribe() {
    var saneThis = this;
    saneThis.isWorking++;
    fetch(`${server}/agent/${this.agentState}/${encodeURI(this.agentName)}`,
      {
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        method: "DELETE",
        body: JSON.stringify({
          url: `https://7cht5e6rof.execute-api.us-west-2.amazonaws.com/Prod/webhook/${this.agentState}/${this.agentName}`
        })
      })
      .then(function (res) { saneThis.isWorking--; return res.json() })
      .then(function (res) { console.log(res); }) // don't forget to bind or JavaScript with drop it's brain on the floor.
      .catch(function (err) { console.log(err); })
  }

  @action agentLoadLog() {
    var saneThis = this;
    saneThis.isWorking++;
    fetch(`${server}/report/${this.agentState}/${this.agentName}`,
      {
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        method: "GET"
      })
      .then(function (res) { saneThis.isWorking--; return res.json() })
      .then(function (res) { console.log(res); saneThis.agentLog = res }) // don't forget to bind or JavaScript with drop it's brain on the floor.
      .catch(function (err) { console.log(err); })
  }


  // Producer
  @action notify() {
    var saneThis = this;
    saneThis.isWorking++;
    fetch(`${server}/producer/notify/${this.notifyState}/${this.notifyGender}`,
      {
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        method: "PUT",
        body: JSON.stringify({ msg: this.notifyNote })
      })
      .then(function (res) { saneThis.isWorking--; return res.json() })
      .then(function (res) { console.log(res); }) // don't forget to bind or JavaScript with drop it's brain on the floor.
      .catch(function (err) { console.log(err); })
  }

  @action makeConnection() {

    try {
      this.client = new W3CWebSocket('wss://4makz5wwl5.execute-api.us-west-2.amazonaws.com/Prod')

      this.client.onopen = () => {
        this.heartbeat()
      }

      this.client.onmessage = (evt: any) => {
        // on receiving a message, add it to the list of messages
        console.log(evt)
        this.agentLoadLog() // all messages mean load the log
      }

      this.client.onclose = () => {
        // restarting connection
        this.makeConnection()
      }
    }
    catch (ex) {
      console.log(ex)
    }
  }

  heartbeat() {
    if (!this.client) {
      console.log('no client for heart beat')
      return
    }
    if (this.client.readyState !== 1) return
    console.log('in heart beat')
    this.client.send(JSON.stringify({ "action": "sendmessage", "data": "ping" }))
    setTimeout(this.heartbeat, 120000)
  }

  sendMsg(txt: string) {
    this.client.send(JSON.stringify({ "action": "sendmessage", "data": txt }))
  }


}

const DataStoreImpl = new DataStore();

export interface DataStoreProps {
  mainStore: DataStore
};

export const dataStoreDefaultProps = {
  mainStore: (null as unknown) as DataStore
};

export default DataStoreImpl;

