import mqtt, { MqttClient } from 'mqtt';
import { MessageController } from '@services';

const message = new MessageController();

export class BrokerClient {
    #client: MqttClient;
    #subscribeTopic: string;

    constructor() {
        // Implement BROKER authentication
        this.#subscribeTopic = 'v1/devices/sendMessage'
        this.#client = mqtt.connect(this.#formatAddress());
        this.#init();
    }

    #init() {
        this.#client.on("connect", () => {
            console.log(`CONNECTED... LISTENING: ${this.#subscribeTopic}`);
            this.#client.subscribe(`${this.#subscribeTopic}`);
            this.#client.on('message', this.processMessage)
        })
        
        this.#client.on("error", (error) => { 
            console.log(`Can't connect: ${error}`); 
        });
    }

    processMessage (topic: string, message: any, packet: any) {
            // Proccess message here;
            let str = `\nTOPIC: ${topic} RECEIVED --\n`;
            str += `message:${message}`;
            console.log(str);
    }

    publishMessage(message: string) {
        this.#client.publish(this.#subscribeTopic, message);
    }

    #formatAddress() {
        const broker = process.env.MQTT_BROKER_ADDR;
        const address = `mqtt://${broker}` + ((process.env.ENV === 'dev') ? ':1883' : '');
        return address;
    }

}


