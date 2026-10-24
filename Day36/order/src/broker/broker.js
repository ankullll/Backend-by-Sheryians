const amqplib = require("amqplib")


let channel,connection;

async function connect() {
    
    if(connection) return connection;
    try {
        connection = await amqplib.connect(process.env.RABBIT_URL);
        console.log("Connected to Rabbit MQ")

        channel = await connection.createChannel()

    } catch (error) {
        console.log("Error connecting to rabbitMQ:",error)
    }
}

async function publishToQueue(queueName,data={}) {

    if(!channel || !connection) await connect()


      await channel.assertQueue(queueName,{
        durable:true
      })  
//      queue ke andar data hmesa buffer form me jata h
      channel.sendToQueue(queueName,Buffer.from(JSON.stringify(data)));
      console.log("Message sent to queue:",queueName,data)
}


async function subscribeToQueue(queueName,callback){

    if(!channel || !connection) await connect();

    await channel.assertQueue(queueName,{
        durable:true
    })

    channel.consume(queueName,async(msg)=>{
        if(msg !== null){
            const data = JSON.parse(msg.content.toString())
            await callback(data);
            channel.ack(msg)
        }
    })
}


module.exports ={connect,channel,connection,publishToQueue,subscribeToQueue}