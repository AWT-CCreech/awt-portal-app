// This function convert a camelCase String to PascalCase String and add space to it
export function toPascalCase(str: String): String { 
    return str.replace( /([A-Z])/g, " $1" )
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word) 
        { 
            return word.toUpperCase(); 
        }); 
}

// lowercase the first letter of a string
export function toLowerFirstLetter(string: String) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

// convert a Date to date string MM/dd/yyyy
export function getDateString(date: Date) {
    return (((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) 
                + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) 
                + '/' + date.getFullYear());
}