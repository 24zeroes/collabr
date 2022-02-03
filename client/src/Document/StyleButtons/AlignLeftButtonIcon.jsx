import React from 'react';

function AlignLeftButtonIcon(props) {
    return (
        <svg
        style={{width: 1 + 'em', height: 1 + 'em', verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden'}}
        viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M128 128h768v85.333H128V128m0 170.667h512V384H128v-85.333m0 170.666h768v85.334H128v-85.334M128 640h512v85.333H128V640m0 170.667h768V896H128v-85.333z"  />
        </svg>
    );
}

export default AlignLeftButtonIcon;