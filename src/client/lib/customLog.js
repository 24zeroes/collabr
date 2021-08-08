const level = 
    Object.freeze(
        {
            "debug" : 0, 
            "info" : 1, 
            "warning" : 2, 
            "error" : 3, 
        }
    );

function customLog(message, level = 0) {
    if (config.logLevel > level)
    {
        return;
    }

    switch (level) {
        case 0:  
            level = 'Green'
            break
        case 1:     
            level = 'Blue'  
            break;
        case 2:   
            level = 'Orange'
            break;
        case 3:  
            level = 'Red'
            break;
        default: 
            level = 'Black'
    }

    console.log(`%c${message}`, `color:${level}`)
}