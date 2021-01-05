import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {SocketIoApplication} from '@loopback/socketio/dist/socketio.application';
import debugFactory from 'debug';
import path from 'path';
import {SocketIoController} from './controllers/websocket.controller';
import {MySequence} from './sequence';
export {ApplicationConfig};

export class LbSocketApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}

const debug = debugFactory('loopback:example:socketio:demo');

export class socketApplication extends BootMixin(SocketIoApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.projectRoot = __dirname;

    this.socketServer.use((socket, next) => {
      // debug('Global middleware - socket:', socket.id);
      next();
    });

    const ns = this.socketServer.route(SocketIoController);
    ns.use((socket, next) => {
      // debug(
      //   'Middleware for namespace %s - socket: %s',
      //   socket.nsp.name,
      //   socket.id,
      // );
      next();
    });
  }
}

