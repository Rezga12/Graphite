import React from "react";
import styles from './TypeLabel.module.css'
import {TypeKind} from "graphql";
import Marker from "../marker/Marker";

export default class TypeLabel extends React.Component{
    constructor(props) {
        super(props);
        this.name = "";
    }

    handleClick = () => {
        if(this.props.control){
            console.log(this.name);
        }
    }

    getTypeName(type){
        if(type === null){
            return <label className={styles.plain}>unknown</label>;
        }

        const controlClass = this.props.control ? styles.underline : styles.plain;

        switch (type.kind) {
            case TypeKind.NON_NULL:
                return (<label className={styles.plain}>{this.getTypeName(type.ofType)}!</label>);
            case TypeKind.LIST:
                return (<label className={styles.plain}>[{this.getTypeName(type.ofType)}]</label>);
            default:
                this.name = type.name;
                return <label className={controlClass} onClick={this.handleClick}><Marker word={type.name} pattern={this.props.pattern}/></label>;
        }
    }

    render(){
       return this.getTypeName(this.props.type);
    }
}