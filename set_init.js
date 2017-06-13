import React from 'react';

const style = {
    input_box: {
        width: 100,
        height: 50,
        backgroundColor: 'white',
        border: '1px solid black',
        fontSize: 30
    },

    button: {
        width: 100,
        height: 50,
        backgroundColor: 'yellow',
        border: '1px solid black',
        fontSize: 30
    }
};

export default class SetInit extends React.Component {
    render() {
        return (
            <div>
                <div
                    contentEditable={ true }
                    ref={ node => this.init_input = node }
                    style={ style.input_box }
                />
                <br/>
                <div
                    onClick={() => {
                        const init_number = parseInt(this.init_input.textContent);
                        if (!isNaN(init_number) && 0 <= init_number && init_number <= 99) {
                            alert('setting init number to: ' + init_number);
                            document.socket.emit('write_init_number', init_number);
                        }

                        else alert('wrong input!');
                    }}
                    style={ style.button }
                >
                    set init!
                </div>
            </div>
        );
    }
};
