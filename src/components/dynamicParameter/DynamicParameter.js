import React from "react";
import styles from "./DynamicParameter.module.css"
import {TypeKind} from "graphql";

export default class DynamicParameter extends React.Component{
    constructor(props) {
        super(props);

        this.state={
            active: false
        }

        this.field = {}
    }

    handleClick = e => {
        let key = "final";
        let typeKind = this.getTypeKindRecursively(this.props.model.type);
        console.log("recursive type kind", typeKind);
        if(typeKind === TypeKind.OBJECT){
            key = {}
        }

        if(this.state.active){
            this.field = {}
            this.props.receiver({
                [this.props.model.name]: null
            });
        }else{
            this.props.receiver({
                [this.props.model.name]: key
            });
        }

        this.setState({
            active: !this.state.active
        })
    }

    receiveFromChild = fields => {
        this.field = {...this.field, ...fields};

        this.props.receiver({
            [this.props.model.name]: this.field
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



    render(){

        return <div style={{marginLeft: `${this.props.tab}em`}} className={styles.container}>
            <button onClick={this.handleClick} className={styles.button}>{this.state.active ? "-" : "+"}</button>
            <span className={this.state.active ? styles.active : ''}>
                {this.props.model.name}
            </span>
            {this.state.active && this.renderFields()}
        </div>
    }
}
