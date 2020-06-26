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
        this.queryObject = {...this.queryObject, ...fields}
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

    serializeQuery(queryObject){
        let res = ''

        const keys = Object.keys(queryObject);
        for(let i=0;i<keys.length;i++){
            const key = keys[i];
            if(queryObject[key] === null){
                continue;
            }

            if(queryObject[key] === 'final') {
                res += key + ' ';
            }
            else if(Object.keys(queryObject[key]).length === 0){
                return null;
            }else{
                const addition = this.serializeQuery(queryObject[key]);
                if(!addition){
                    return null;
                }
                res += key + '{';
                res += addition + ' ';
                res += '}';
            }
        }

        return res;
    }

    handleClick = e => {
        const serializedQuery = this.serializeQuery(this.queryObject);
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
