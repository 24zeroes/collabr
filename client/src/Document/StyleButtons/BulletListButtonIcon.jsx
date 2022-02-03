import React from 'react';

function BulletListButtonIcon(props) {
    return (
        <svg 
            style={{width: '1em', height: '1em', verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden'}}
            viewBox="0 0 1024 1024" version="1.1" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M298.667 213.333v85.334H896v-85.334M298.667 554.667H896v-85.334H298.667m0 341.334H896v-85.334H298.667m-128-14.08c-31.574 0-56.747 25.6-56.747 56.747s25.6 56.747 56.747 56.747c31.146 0 56.746-25.6 56.746-56.747s-25.173-56.747-56.746-56.747m0-519.253c-35.414 0-64 28.587-64 64s28.586 64 64 64c35.413 0 64-28.587 64-64s-28.587-64-64-64m0 256c-35.414 0-64 28.587-64 64s28.586 64 64 64c35.413 0 64-28.587 64-64s-28.587-64-64-64z"  />
        </svg>
    );
}

export default BulletListButtonIcon;