import React    from 'react';
import ReactDOM from 'react-dom';
import io       from 'socket.io-client';

const read_all_unread_messages = message_list => {
    console.log('[front] reading mode');

    const unread_count = message_list.reduce((count, message) =>
        count + (message.is_read ? 0 : 1)
    , 0);

    console.log('[front] unread_count:', unread_count);

    if (unread_count > 0) {
        console.log('[front] some message is not read');
        console.log('[front] read_all_messages sent');
        socket.emit('read_all_messages');
    }

    else {
        console.log('[front] everything is read');
    }
}

class App extends React.Component {
    componentDidMount() {
        // if in reading mode and if anything is unread
        // then emit read_all_messages event
        if (document.location.pathname == '/read') {
            read_all_unread_messages(this.props.message_list);
        }
    }

    componentDidUpdate() {
        // if in reading mode and if anything is unread
        // then emit read_all_messages event
        if (document.location.pathname == '/read') {
            read_all_unread_messages(this.props.message_list);
        }
    }

    render() {
        return (
            <div>
                Hello World!
                { this.props.message_list.map((message, i) => (
                    <div key={ i }>
                        { new Date(message.time) + '' }
                        { message.content }
                        { message.is_read ? '' : '1' }
                    </div>
                ))}

                <br/>
                <input type="text" ref={ node => this.chat_box = node }/>

                <div onClick={ () => {
                    const message_content = this.chat_box.value
                    console.log('[front] writing one message:', message_content);

                    if (this.chat_box.value.length > 0) {
                        socket.emit('write_one_message', message_content);
                        this.chat_box.value = '';
                    }
                }}>
                    Send
                </div>
            </div>
        );
    }
}

const socket = io.connect('http://143.248.250.17:8811/client');

socket.on('connect', () => {
    console.log('[front] connected to socket server');

    ReactDOM.render(
        <App message_list={[]}/>,
        document.getElementById('root_div')
    );
});

socket.on('message_list_updated', res => {
    console.log('[front] new message_list received!');

    ReactDOM.render(
        <App message_list={ res.message_list }/>,
        document.getElementById('root_div')
    );
});
