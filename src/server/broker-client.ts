import mqtt, { MqttClient } from 'mqtt';
import { MessageController } from '@services';

const message = new MessageController();

export class BrokerClient {
    #client: MqttClient;
    #subscribeTopic: string;

    constructor() {
        // Implement BROKER authentication
        this.#subscribeTopic = 'v1/manager/message'
        this.#client = mqtt.connect(this.#formatAddress());
        this.#init();
    }

    #init() {
        this.#client.on("connect", () => {
            console.log(`CONNECTED... LISTENING: ${this.#subscribeTopic}`);
            this.#client.subscribe(`${this.#subscribeTopic}`);
            this.#client.on('message', message.processMessage)
        })
        
        this.#client.on("error", (error) => { 
            console.log(`Can't connect: ${error}`); 
        });
    }

    #formatAddress() {
        const broker = process.env.MQTT_BROKER_ADDR;
        const address = `mqtt://${broker}` + ((process.env.ENV === 'dev') ? ':1883' : '');
        return address;
    }

}


