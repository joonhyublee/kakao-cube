const http = require('http');
const fs   = require('fs');
const page = fs.readFileSync('./index.html');
const app  = fs.readFileSync('./bundle.js');

const server = http.createServer((req, res) => {
    if (req.url == '/app.js') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(app);
    }

    else if (req.url == '/unread_count') {
        const message_list = JSON.parse(fs.readFileSync('./data.json')).message_list;
        const unread_count = message_list.reduce((count, message) =>
            count + (message.is_read ? 0 : 1)
        , 0)
        res.end(unread_count + '');
    }

    else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(page);
    }
});

const io = require('socket.io')(server);
io.of('/client').on('connection', socket => {

    // send messages for the first time
    const message_list = JSON.parse(fs.readFileSync('./data.json')).message_list;
    socket.emit('message_list_updated', { message_list });

    // bind response to request events
    // upon write_one_message event
    socket.on('write_one_message', message_content => {

        // load datea file
        // const data_file = fs.readFileSync('./data.json');
        // console.log(data_file);
        // const data_obj = JSON.parse(data_file);
        // console.log(data_obj);
        // const old_message_list = data_obj.message_list;
        // console.log(old_message_list);
        const old_message_list = JSON.parse(fs.readFileSync('./data.json')).message_list;

        // create new message and append it to message list
        let new_message_list = [
            ...old_message_list,
            {
                time: Date.now(),
                content: message_content,
                is_read: false
            }
        ];

        // if number of message is over 99, truncate to 99 messages
        if (new_message_list.length > 99) {
            new_message_list = new_message_list.slice(
                new_message_list.length - 99, new_message_list.length
            );
        }

        // send message to everyone
        io.of('/client').emit('message_list_updated', { message_list: new_message_list });

        // write to file
        fs.writeFileSync('./data.json', JSON.stringify({ message_list: new_message_list }));
    });

    // upon read_all_messages event
    socket.on('read_all_messages', () => {

        // load datea file
        const old_message_list = JSON.parse(fs.readFileSync('./data.json')).message_list;

        // mark all messages as read
        const new_message_list = old_message_list.map(message =>
            Object.assign({}, message, { is_read: true })
        );

        // send message to everyone
        io.of('/client').emit('message_list_updated', { message_list: new_message_list });

        // write to file
        fs.writeFileSync('./data.json', JSON.stringify({ message_list: new_message_list }));
    });
});

server.listen(8881, () => {
    console.log("kakao-cube server is running!");
});
