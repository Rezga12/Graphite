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
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    renderQuery(){
        switch (this.state.queryType) {
            case this.queryType.query:
                return this.renderFields(this.props.schema.queryType);
            case this.queryType.mutation:
                return null;
            case this.queryType.__schema:
                return null;
            default:
                return null;
        }
    }

    renderFields(model){
        return model.fields.map(field => <DynamicParameter key={'q' + field.name}
                                                           model={field}
                                                           typeDict={this.props.typeDict}
                                            />)
    }

    renderFieldTypes(){
        if(this.state.queryFieldType === undefined){
            return null;
        }
        let model;
        this.props.schema.queryType.fields.forEach(field => {
            if(field.name === this.state.queryFieldType){
                model = field;
            }
        });

        if(model === undefined){
            return null;
        }

        console.log("model: ", model);
    }

    queryFieldTypeChanged = e => {
        this.setState({
            queryFieldType: e.target.value,
        })
    }

    handleQueryTypeChange = e =>{
        this.setState({
            queryType: e.target.value
        })
    }

    render() {
        return (
            <div className={styles.container} >
                <div className={styles.textareaContainer} >
                    <select onChange={this.handleQueryTypeChange} className={styles.select}>
                        <option>Select query type</option>
                        <option>query</option>
                        <option>mutation</option>
                        <option>__schema</option>
                    </select>
                    {this.renderQuery()}
                    {this.renderFieldTypes()}
                </div>
                <button className={styles.button} onClick={this.handleClick}>
                    Send Query
                </button>
            </div>
        );
    }

    handleClick = e => {
        this.props.queryHandler(this.textareaRef.current.textContent);
    }
}
