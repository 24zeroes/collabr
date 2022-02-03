import React from 'react';

function BoldButtonIcon(props) {
    return (
        <svg 
            style={{width: '1em', height: '1em', verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden'}}
            viewBox="0 0 1024 1024" 
            version="1.1"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M576 661.333H426.667v-128H576c35.413 0 64 28.587 64 64 0 35.414-28.587 64-64 64m-149.333-384h128c35.413 0 64 28.587 64 64 0 35.414-28.587 64-64 64h-128m238.933 55.04C706.987 431.36 736 384 736 341.333c0-96.426-74.667-170.666-170.667-170.666H298.667V768H599.04c89.6 0 158.293-72.533 158.293-161.707 0-64.853-36.693-120.32-91.733-145.92z"  />
        </svg>
    );
}

export default BoldButtonIcon;