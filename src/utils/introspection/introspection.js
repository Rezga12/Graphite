import { gql } from 'graphql.macro';

export const queryObject1 = gql`
    query {
        __schema{
            types{
                name
            }
        }
    }
`;

export const queryObject = gql`
    
    query {
        __schema{
            types{
                ...Type
            }
            queryType{
                ...Type
            }
            mutationType{
                ...Type
            }
            
        }
    }
    
    fragment Type on __Type{
        kind
        name
        description
        fields{
            ...Field
        }
        interfaces{
            ...RecursiveType
        }
        possibleTypes{
            name
            kind
        }
        enumValues{
            name,
            description
        }
        inputFields{
            name
            description
            defaultValue
            type{
                ...RecursiveType
            }
        }
    }
    
    fragment Field on __Field{
        name
        description
        type{
            ...RecursiveType
        }
        args{
            name
            description
            type{
                ...RecursiveType
            }
            defaultValue
        }
    }
    
    fragment RecursiveType on __Type{
        name
        kind
        ofType{
            name
            kind
            ofType{
                name
                kind
                ofType{
                    name
                    kind
                    ofType{
                        name
                        kind
                        ofType{
                            name
                            kind
                            ofType{
                                name
                                kind
                                ofType{
                                    name
                                    kind
                                    ofType{
                                        name
                                        kind
                                        ofType{
                                            name
                                            kind
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const introspectionQuery = queryObject.loc.source.body;
