import React from "react";
import styles from "./QueryField.module.css"
import DynamicParameter from "../dynamicParameter/DynamicParameter";

export default class QueryField extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            queryType: undefined,
            queryFieldType: undefined,
        }

        this.queryType = {
            query: 'query',
            mutation: 'mutation',
            __schema: '__schema'
        }

        this.queryObject = {}
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    renderQuery(){
        switch (this.state.queryType) {
            case this.queryType.query:
                return this.renderFields(this.props.schema.queryType);
            case this.queryType.mutation:
                return this.renderFields(this.props.schema.mutationType);
            case this.queryType.__schema:
                return this.renderFields(this.props.typeDict["__Schema"]);
            default:
                return null;
        }
    }

    renderFields(model){
        return model.fields.map(field => <DynamicParameter key={'q' + field.name}
                                                           model={field}
                                                           typeDict={this.props.typeDict}
                                                           tab={2}
                                                           receiver={this.receiveQueryFields}
                                            />)
    }

    handleQueryTypeChange = e =>{
        this.setState({
            queryType: e.target.value
        })
    }

    receiveQueryFields = fields => {
        this.queryObject.fields = {...this.queryObject.fields, ...fields.fields}
        this.queryObject.args = {...this.queryObject.args, ...fields.args}

        console.log(this.queryObject);
    }

    render() {
        return (
            <div className={styles.container} >
                {!this.props.connected && <span className={styles.red}>connection not established...</span>}
                {this.props.connected && <div className={styles.textareaContainer} >

                    <select onChange={this.handleQueryTypeChange} className={styles.select}>
                        <option>Select query type</option>
                        <option>query</option>
                        <option>mutation</option>
                        <option>__schema</option>
                    </select>
                    {this.renderQuery()}
                </div>}
                {this.props.connected && <button className={styles.button} onClick={this.handleClick}>
                    Send Query
                </button>}
            </div>
        );
    }

    serializeJson(args){
        let res = '';
        if(typeof args === 'object'){
            if(args){
                res += '{'
                const keys = Object.keys(args);
                keys.forEach((key, i) => {
                    res += key
                    res += ':';
                    res += this.serializeJson(args[key])
                    res += i === keys.length - 1 ? '' : ','
                })
                res += '}'
            }else{
                return null;
            }
        }else if(typeof args === 'string'){
            res += '"';
            res += args
            res += '"';
        }else if(typeof  args === 'number'){
            res += args
        }

        return res;
    }

    serializeQuery(queryObject){
        let res = ''

        const keys = Object.keys(queryObject);
        for(let i=0;i<keys.length;i++){
            const key = keys[i];
            if(queryObject[key] === null){
                continue;
            }

            const fields = queryObject[key].fields;
            const args = queryObject[key].args;
            let argStr = '';
            if(args && Object.keys(args).length > 0){
                argStr = this.serializeJson(args)
                argStr = '(' + argStr.substr(1,argStr.length-2) + ')';
            }

            if(!Object.keys(fields).length) {
                res += key + argStr + ' ';
            }
            else if(Object.keys(fields).length === 0){
                return null;
            }else{
                const addition = this.serializeQuery(fields);
                if(!addition){
                    return null;
                }

                res += key + argStr + '{';
                res += addition + ' ';
                res += '}';
            }
        }

        return res;
    }

    handleClick = e => {
        const serializedQuery = this.serializeQuery(this.queryObject.fields);
        if(!serializedQuery){
            alert("error message gonna be better")
            return
        }

        let query = `${this.state.queryType}{${serializedQuery}}`;
        if(this.state.queryType === this.queryType.__schema){
            query = `{ ${this.state.queryType}{${serializedQuery}}}`;
        }

        this.props.queryHandler(query);
    }
}
