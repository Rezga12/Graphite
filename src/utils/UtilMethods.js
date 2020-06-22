import {TypeKind} from "graphql";

export function typeLabelContainsPattern(type, pattern){
    if(type.kind !== TypeKind.LIST && type.kind !== TypeKind.NON_NULL){
        return type.name.includes(pattern);
    }

    return typeLabelContainsPattern(type.ofType, pattern);
}

function inputFieldCheck(fields, pattern){
    return fields.reduce((result, currField) =>
        result ||
        currField.name.includes(pattern) ||
        typeLabelContainsPattern(currField.type, pattern),
        false);
}

export function fullTypeContainsPattern(type, pattern){
    let result = type.name.includes(pattern);

    if(type.interfaces !== null){
        result = type.interfaces.reduce((prevType, currType) => prevType || currType.name.includes(pattern),result);
    }

    if(type.possibleTypes !== null){
        result = type.possibleTypes.reduce((prevType, currType) => prevType || currType.name.includes(pattern),result);
    }

    if(type.inputFields !== null){
        result = result || inputFieldCheck(type.inputFields, pattern)
    }

    if(type.enumValues !== null){
        result = type.enumValues.reduce((prevType, currType) => prevType || currType.name.includes(pattern),result);
    }

    if(type.fields !== null){
        result = type.fields.reduce((res, currField) =>
            res ||
            currField.name.includes(pattern) ||
            typeLabelContainsPattern(currField.type, pattern) ||
            inputFieldCheck(currField.args, pattern),
            result);
    }

    return result;
}

export function removeWhitespaceForQuery(query){
    let result = '';

    for (let i=0;i<query.length;i++){
        if(query[i]){

        }
    }
}
