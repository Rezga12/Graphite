import React from "react";
import styles from "./DynamicParameter.module.css"
import {TypeKind} from "graphql";
import InputParameter from "../InputParameter/InputParameter";

export default class DynamicParameter extends React.Component{
    constructor(props) {
        super(props);

        this.state={
            active: false
        }

        this.field = {fields:{}, args:{}}
    }

    handleClick = e => {
        let key = {fields: {}, args:{}};

        if(this.state.active){
            this.field = {fields: {}, args:{}}
            this.props.receiver({
                fields: {
                    [this.props.model.name]: null
                },
                args: {}
            });
        }else{
            this.props.receiver({
                fields: {
                    [this.props.model.name]: key
                },
                args: {}
            });
        }

        this.setState({
            active: !this.state.active
        })
    }

    receiveFromChild = fields => {
        this.field.fields = {...this.field.fields, ...fields.fields};
        this.field.args = {...this.field.args, ...fields.args};

        this.props.receiver({
            fields: {
                [this.props.model.name]: this.field
            },
            args: {}
        });
    }

    getTypeNameRecursively(type){
        if(type.kind === TypeKind.NON_NULL || type.kind === TypeKind.LIST){
            return this.getTypeNameRecursively(type.ofType)
        }

        return type.name;
    }

    getTypeKindRecursively(type){
        if(type.kind === TypeKind.NON_NULL || type.kind === TypeKind.LIST){
            return this.getTypeKindRecursively(type.ofType)
        }

        return type.kind;
    }

    renderFields(){
        if(this.props.typeDict[this.getTypeNameRecursively(this.props.model.type)].fields === null){
            return null;
        }

        return this.props.typeDict[this.getTypeNameRecursively(this.props.model.type)].fields.map(field =>
            <DynamicParameter key={field.name}
                              model={field}
                              typeDict={this.props.typeDict}
                              tab={2}
                              receiver={this.receiveFromChild}
            />
        );
    }

    renderArgs(){
        if(!this.props.model.args?.length){
            return null;
        }

        return this.props.model.args.map(arg =>
            <InputParameter key={arg.name}
                            model={arg}
                            typeDict={this.props.typeDict}
                            receiver={this.receiveFromChild}
                            clickHandler={()=>{}}
            />
        );
    }

    render(){
        const type = this.props.typeDict[this.getTypeNameRecursively(this.props.model.type)];
        const fieldCount = type.fields?.length;
        const argCount = this.props.model.args?.length;

        return (<div style={{marginLeft: `${this.props.tab}em`}} className={styles.container}>
                    <button onClick={this.handleClick} className={styles.button}>{this.state.active ? "-" : "+"}</button>
                    <span className={this.state.active ? styles.active : ''}>
                        {this.props.model.name}
                    </span>
                    {(this.state.active && argCount > 0) && <div className={styles.inputFieldLabel} style={{marginLeft: '1em'}}>Input Fields: </div>}
                    {this.state.active && this.renderArgs()}
                    {(this.state.active && fieldCount > 0) && <div className={styles.queryFieldLabel} style={{marginLeft: '1em'}}>Result Fields: </div>}
                    {this.state.active && this.renderFields()}
                </div>);
    }
}
