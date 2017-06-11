import React    from 'react';
import ReactDOM from 'react-dom';
import io       from 'socket.io-client';
import Home     from './home.js';

const style = {
    container: {
        backgroundColor: '#a0c0d7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        fontFamily: 'sans-serif',
        paddingBottom: 120
    },

    top_status_bar: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: 40,
        backgroundColor: 'rgba(160, 192, 215, 0.95)',
    },

    top_bar: {
        position: 'fixed',
        top: 40,
        left: 0,
        width: '100%',
        height: 90, // subtract system status bar height
        backgroundColor: 'rgba(160, 192, 215, 0.95)',
        borderBottom: '1px solid rgb(152, 182, 204)',
        display: 'flex'
    },

    top_bar_left: {
        // backgroundColor: 'beige',
        width: '33.3%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    top_bar_center: {
        // backgroundColor: 'pink',
        width: '33.3%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 35,
        fontWeight: 600
    },

    top_bar_right: {
        // backgroundColor: 'green',
        width: '33.3%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },

    top_bar_left_icon: {
        marginLeft: 22,
        width: 40,
        height: 40,
        // border: '1px solid black'
    },

    top_bar_right_icon: {
        marginRight: 35,
        width: 40,
        height: 40,
        // border: '1px solid black'
    },

    chat_container: {
        display: 'flex'
    },

    chat_info_column: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        textAlign: 'right',
        margin: '0px 10px',
        fontSize: 20
    },

    chat_info_unread_count: {
        color: '#ffeb00',
        textShadow: '1px 1px rgb(132, 158, 177)'
    },

    chat_info_time: {
        color: 'rgb(96, 115, 129)'
    },

    chat_bubble: {
        maxWidth: 500,
        backgroundColor: '#ffeb00',
        marginTop: 10,
        // minHeight: 70,
        padding: '17px 15px 17px 15px', // 18px
        fontSize: 30,
        borderRadius: 5
    },

    chat_bubble_reading_mode: {
        maxWidth: 500,
        backgroundColor: 'white',
        marginTop: 10,
        // minHeight: 70,
        padding: '17px 15px 17px 15px', // 18px
        fontSize: 30,
        borderRadius: 5
    },

    chat_bubble_head: {
        width: 35
    },

    text_bar: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 100,
        backgroundColor: '#eeeeee',
        display: 'flex',
        alignItems: 'center'
    },

    text_bar_left_icon: {
        width: 40,
        height: 40,
        // border: '1px solid black',
        marginLeft: 20,
        marginRight: 20
    },

    text_bar_input_container: {
        height: 64,
        flexGrow: 1,
        borderRadius: 5,
        border: '1px solid rgb(202, 202, 202)',
        backgroundColor: 'white',
        marginRight: 12,
        display: 'flex',
        alignItems: 'center'
    },

    text_bar_input: {
        height: 64,
        flexGrow: 1,
        fontSize: 30,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 17
    },
    
    text_bar_right_icon: {
        width: 40,
        height: 40,
        // border: '1px solid black',
        marginRight: 20
    },

    text_bar_send_button: {
        width: 80,
        height: 64,
        backgroundColor: '#ffeb00',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 26,
        color: 'rgb(115, 107, 36)',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        borderLeft: '1px solid #d7d7d7',
        fontWeight: 600
    }
}

const convert_time = time_obj => {
    let timeString = '';

    let firstString = '오전';
    let hours = time_obj.getHours();
    let mins = time_obj.getMinutes();

    if (hours > 12) {
        hours = hours - 12; firstString = '오후';
    }

    hours = hours + '';
    mins = mins + ''; 

    if (mins.length < 2) {
        mins = '0' + mins;
    }

    timeString = firstString + ' ' + hours + ':' + mins;
    return timeString;
}

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
        window.scrollTo(0,document.body.scrollHeight);
    }

    componentDidUpdate() {
        // if in reading mode and if anything is unread
        // then emit read_all_messages event
        if (document.location.pathname == '/read') {
            read_all_unread_messages(this.props.message_list);
        }
        window.scrollTo(0,document.body.scrollHeight);
    }

    render() {
        return (
            <div style={ style.container }>
                <div style={ style.top_status_bar }/>

                <div style={ style.top_bar }>
                    <div style={ style.top_bar_left }>
                        <div style={ style.top_bar_left_icon }>
                            <svg
                                // back button
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                            >
                                <path
                                    fill="none"
                                    strokeWidth="4"
                                    stroke="rgb(32, 38, 43)"
                                    strokeLinecap="round"
                                    d="M 23 2 L 2 20 L 23 38"
                                />
                            </svg>
                        </div>
                    </div>

                    <div style={ style.top_bar_center }>
                        안상균
                    </div>

                    <div style={ style.top_bar_right }>
                        <div style={ style.top_bar_right_icon }>
                            <svg
                                // search button
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                            >
                                <ellipse
                                    cx="16"
                                    cy="16"
                                    rx="14"
                                    ry="14"
                                    fill="none"
                                    strokeWidth="4"
                                    stroke="rgb(32, 38, 43)"
                                />
                                <path
                                    fill="none"
                                    strokeWidth="4"
                                    stroke="rgb(32, 38, 43)"
                                    strokeLinecap="round"
                                    d="M 26 26 L 38 38"
                                />
                            </svg>
                        </div>

                        <div style={ style.top_bar_right_icon }>
                            <svg
                                // hamburger button
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                            >
                                <path
                                    fill="none"
                                    strokeWidth="4"
                                    stroke="rgb(32, 38, 43)"
                                    strokeLinecap="round"
                                    d="M 2 6 L 38 6 M 2 20 L 38 20 M 2 34 L 38 34"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                { this.props.message_list.map((message, i) => (
                    <div
                        key={ i }
                        style={ style.chat_container }
                    >
                        <div style={ style.chat_info_column }>
                            <div style={ style.chat_info_unread_count }>
                                { message.is_read ? '' : '1' }
                            </div>

                            <div style={ style.chat_info_time }>
                                { convert_time(new Date(message.time)) }
                            </div>
                        </div>

                        <div style={ style.chat_bubble }>
                            { message.content }
                        </div>

                        <div style={ style.chat_bubble_head }>
                        </div>
                    </div>
                ))}

                <div style={ style.text_bar }>
                    <div style={ style.text_bar_left_icon }>
                        <svg
                            // plus button
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                        >
                            <path
                                fill="none"
                                strokeWidth="5"
                                stroke="rgb(160, 160, 160)"
                                strokeLinecap="round"
                                d="M 2 20 L 38 20 M 20 2 L 20 38"
                            />
                        </svg>
                    </div>

                    <div style={ style.text_bar_input_container }>
                        <div
                            contentEditable={ true }
                            ref={ node => this.chat_box = node }
                            style={ style.text_bar_input }
                        />

                        <div style={ style.text_bar_right_icon }>
                            <svg
                                // smile button
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                            >
                                <ellipse
                                    // face
                                    cx="20" cy="20" rx="19" ry="19"
                                    fill="none"
                                    strokeWidth="3"
                                    stroke="rgb(160, 160, 160)"
                                />

                                <ellipse
                                    // left eye
                                    cx="13" cy="15" rx="2" ry="3"
                                    fill="rgb(160, 160, 160)"
                                    strokeWidth="0"
                                />

                                <ellipse
                                    // right eye
                                    cx="27" cy="15" rx="2" ry="3"
                                    fill="rgb(160, 160, 160)"
                                    strokeWidth="0"
                                />

                                <path
                                    // nose
                                    fill="none"
                                    strokeWidth="3"
                                    stroke="rgb(160, 160, 160)"
                                    strokeLinecap="round"
                                    d="M 20 18 q -3 2 0 4"
                                />

                                <path
                                    // nose
                                    fill="none"
                                    strokeWidth="3"
                                    stroke="rgb(160, 160, 160)"
                                    strokeLinecap="round"
                                    d="M 13 25 q 7 8 14 0"
                                />
                            </svg>
                        </div>

                        <div
                            onClick={() => {
                                const message_content = this.chat_box.textContent;
                                console.log('[front] writing one message:', message_content);

                                if (this.chat_box.textContent.length > 0) {
                                    socket.emit('write_one_message', message_content);
                                    this.chat_box.textContent = '';
                                }
                            }}
                            style={ style.text_bar_send_button }
                        >
                            전송
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const socket = io.connect('http://143.248.250.17:8811/client');

socket.on('connect', () => {
    console.log('[front] connected to socket server');

    const unread_count = 0;

    ReactDOM.render(
        document.location.pathname == '/home'
            ? <Home unread_count={ unread_count }/>
            : <App message_list={[]}/>,
        document.getElementById('root_div')
    );
});

socket.on('message_list_updated', res => {
    console.log('[front] new message_list received!');

    const unread_count = res.message_list.reduce((count, message) =>
        count + (message.is_read ? 0 : 1)
    , 0)

    ReactDOM.render(
        document.location.pathname == '/home'
            ? <Home unread_count={ unread_count }/>
            : <App message_list={ res.message_list }/>,
        document.getElementById('root_div')
    );
});
