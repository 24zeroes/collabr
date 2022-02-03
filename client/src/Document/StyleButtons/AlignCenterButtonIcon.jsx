import React from 'react';

function AlignCenterButtonIcon(props) {
    return (
        <svg
        style={{width: 1 + 'em', height: 1 + 'em', verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden'}}
        viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M128 128h768v85.333H128V128m170.667 170.667h426.666V384H298.667v-85.333M128 469.333h768v85.334H128v-85.334M298.667 640h426.666v85.333H298.667V640M128 810.667h768V896H128v-85.333z"  />
        </svg>
    );
}

export default AlignCenterButtonIcon;