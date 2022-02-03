import React from 'react';

function StyleButton(props) {
    return (
      <button
      className='styleButton'
        key={props.cmd}
        onMouseDown={evt => {
          evt.preventDefault(); // Avoids loosing focus from the editable area
          document.execCommand(props.cmd, false, props.arg); // Send the command to the browser
        }}
      >
        {props.icon}
      </button>
    );
  }
  
  export default StyleButton;