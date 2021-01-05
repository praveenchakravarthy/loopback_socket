
import {Socket, socketio} from '@loopback/socketio';
import debugFactory from 'debug';

const debug = debugFactory('loopback:socketio:controller');

@socketio('/')
export class SocketIoController {
  constructor(
    @socketio.socket() // Equivalent to `@inject('ws.socket')`
    private socket: Socket,
  ) { }

  /**
   * The method is invoked when a client connects to the server
   *
   * @param socket - The socket object for client
   */
  @socketio.connect()

  connect(socket: Socket) {
    console.log('Client connected: %s', this.socket.id);
    socket.join('room 1');
  }


  /**
   * Register a handler for 'messages' events
   *
   * @param msg - The message sent by client
   */
  @socketio.subscribe('chat_message')
  // @socketio.emit('namespace' | 'requestor' | 'broadcast')
  handleChatMessage(msg: string) {
    console.log('message: Id %s', this.socket.id, ':', msg);
    this.socket.nsp.emit('chat_message', `[${this.socket.id}] ${msg}`);
  }

  /**
   * Register a handler for 'notification' events
   *
   * @param msg - notification from client
   */
  @socketio.subscribe('alert')
  publishMessage(info: string) {
    console.log('message from client :', info)
    this.socket.nsp.emit('alert', `Notification: ${info}`)
  }

  /**
   * Register a handler for all events
   */
  @socketio.subscribe(/.+/)
  logMessage(...args: any) {
    // console.log('Message: %s', args);
  }

  /**
   * The method is invoked when a client disconnects from the server
   * @param socket
   */
  @socketio.disconnect()
  disconnect() {
    console.log('Client disconnected: %s', this.socket.id);
  }
}
