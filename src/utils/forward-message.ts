import mqtt, { MqttClient } from 'mqtt';
import { Logger } from './logger';

export class ForwardMessage {
    #client: MqttClient;
    #publishTopic: string;

    constructor(deviceHash: string) {
        // Implement BROKER authentication
        this.#publishTopic = `v1/device/${deviceHash}/message`;
        this.#client = mqtt.connect(this.#formatAddress());
    }

    #init() {
        this.#client.on("connect", () => {
            // console.log(`CONNECTED..`);
        })
        
        this.#client.on("error", (error) => { 
            console.log(`Can't connect: ${error}`); 
        });
    }
    
    publishMessage(message: string) {
        this.#init();
        const logger = new Logger('forward-message.ts', '/util/');
        logger.info({ topic: this.#publishTopic, message, action: 'PUBLISH'});
        this.#client.publish(this.#publishTopic, JSON.stringify(message));
    }

    #formatAddress() {
        const broker = process.env.MQTT_BROKER_ADDR;
        const address = `mqtt://${broker}` + ((process.env.ENV === 'dev') ? ':1883' : '');
        return address;
    }

}


