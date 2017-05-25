const http  = require('http');
const fs    = require('fs');
// const page  = fs.readFileSync('./index.html');
// const app   = fs.readFileSync('./bundle.js');

const server = http.createServer((req, res) => {
    res.end("Hello World!");

    // if (req.url == '/app.js') {
    //     res.writeHead(200, { 'Content-Type': 'text/html' });
    //     res.end(app);
    // }

    // else if (req.url == '/unread_count') {
    //     const message_list = JSON.parse(fs.readFileSync('./data.json')).message_list;
    //     res.end(message_list.reduce((unread_count, message) =>
    //         unread_count + (message.read ? 0 : 1)
    //     ), 0);
    // }

    // else {
    //     res.writeHead(200, { 'Content-Type': 'text/html' });
    //     res.end(page);
    // }
});

const io = require('socket.io')(server);
io.of('/client').on('connection', socket => {

    // emit connection message
    socket.emit('you connected to kakao-cube server');

    // bind response to request events
    socket.on('write_one_message', message_content => {

        // load datea file
        const old_message_list = JSON.parse(fs.readFileSync('./data.json')).message_list;

        // create new message and append it to message list
        let new_message_lit = [
            ...old_message_list,
            {
                time: Date.now(),
                content: message_content,
                read: false
            }
        ];

        // if number of message is over 99, truncate to 99 messages
        if (new_message_list.length > 99) {
            new_message_list = new_message_list.slice(
                new_message_list.length - 99, new_message_list.length
            );
        }

        // send message to everyone
        io.of('/client').emit('message_list_updated', { new_message_list });

        // write to file
        fs.writeFileSync('./data.json', JSON.stringify({ new_message_list }));
    });

    socket.on('read_all_messages', () => {

        // load datea file
        const old_message_list = JSON.parse(fs.readFileSync('./data.json')).message_list;

        // mark all messages as read
        const new_message_list = old_message_list.map(message =>
            Object.assign({}, message, { read: true })
        );

        // send message to everyone
        io.of('/client').emit('message_list_updated', { new_message_list });

        // write to file
        fs.writeFileSync('./data.json', JSON.stringify({ new_message_list }));
    });
});

server.listen(8881, () => {
    console.log("kakao-cube server is running!");
});
