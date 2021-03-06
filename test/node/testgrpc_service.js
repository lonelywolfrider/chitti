import grpc from 'grpc';
import { RPCImport, RPCServer, StatsDInterceptor, Chitti, Error } from '../../src/node-src/index';


const { TestgrpcService, CustomError } = RPCImport(require('../proto/test.json')).testgrpc;


class MyService extends TestgrpcService.Service {
    async hellogrpc(req) {
        console.log(req.request);
        return { res_message: 'Hello Grpc !' };
        // throw new CustomError({ custom: 'Error in service' });
    }
}

Error.enable([CustomError], { code: 502 });
Chitti.add_handler_interceptor(StatsDInterceptor);
const grpc_server = new RPCServer();
grpc_server.addService(MyService);
grpc_server.bind('0.0.0.0:8080', grpc.ServerCredentials.createInsecure());
grpc_server.start();
