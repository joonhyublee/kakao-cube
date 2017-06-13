import React    from 'react';

const style = {
    container: {
        width: '100%',
        height: '100%',
        backgroundImage: 'url("https://raw.githubusercontent.com/joonhyublee/kakao-cube/master/home_screen.png")',
        position: 'relative'
    },

    app: {
        position: 'absolute',
        width: 120,
        height: 120,
        bottom: 44,
        right: 54
    },

    badge: {
        position: 'absolute',
        minWidth: 24,
        height: 48,
        right: 34,
        bottom: 136,
        backgroundColor: 'red',
        borderRadius: 24,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0px 12px',
        fontFamily: 'sfd_regular',
        letterSpacing: 1,
        fontSize: 32,
    }
};

export default class Home extends React.Component {
    render() {
        return (
            <div style={ style.container }>
                <div style={ style.app } onClick={() => { document.location.replace('/read') }}/>
                <div style={ style.badge }>
                    { this.props.unread_count }
                </div>
            </div>
        );
    }
}
