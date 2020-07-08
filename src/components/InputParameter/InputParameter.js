import React from "react";
import styles from './InputParameter.module.css'
import {TypeKind} from "graphql";
import InputParameterList from "../inputParameterList/InputParameterList";

export default class InputParameter extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            active: false,
        }

        this.inputs = {}
    }

    handleClick = e => {
        this.props.clickHandler(this.props._key, this.props.index, this.state.active);

        let value = this.getTypeKindRecursively(this.props.model.type) === TypeKind.INPUT_OBJECT ? {} : ""
        if(this.state.active){
            value = null;
        }

        let model = {[this.props.model.name]: value};
        if(this.props.root){
            model = {args: model}
        }
        this.props.receiver(model, this.props.index);

        this.setState({
            active: !this.state.active,
        })
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

    receiveFromChild = (model) => {

        if(this.props.listElem){
            this.props.receiver(model, this.props.index);
            return;
        }

        this.inputs = {...this.inputs, ...model};
        if(Array.isArray(model)){
            this.inputs = model;
        }
        let result = {[this.props.model.name]: this.inputs};

        if(this.props.root){
            result = {args: result};
        }

        this.props.receiver(result, this.props.index);
    }

    isListObject(type){
        switch (type.kind) {
            case TypeKind.NON_NULL:
                return this.isListObject(type.ofType)
            case TypeKind.LIST:
                return true;
            default:
                return false;
        }
    }

    getListElemTypeName(type){
        switch (type.kind) {
            case TypeKind.NON_NULL:
                return this.getListElemTypeName(type.ofType);
            case TypeKind.LIST:
                return this.getTypeNameRecursively(type.ofType);
            default:
                return null;
        }
    }

    renderInputObjects(){
        if(this.isListObject(this.props.model.type)){
            return <InputParameter model={this.props.typeDict[this.getListElemTypeName(this.props.model.type)]}
                                   typeDict={this.props.typeDict}
                                   receiver={this.receiveFromChild}
                                   clickHandler={()=>{}}
                                   listElem={true}
                                   name={this.props.model.name}
            />

        }else if(this.getTypeKindRecursively(this.props.model.type) === TypeKind.INPUT_OBJECT){

            return this.props.typeDict[this.getTypeNameRecursively(this.props.model.type)].inputFields.map(field =>
                        <InputParameter key={field.name}
                                        model={field}
                                        typeDict={this.props.typeDict}
                                        receiver={this.receiveFromChild}
                                        clickHandler={()=>{}}
                        />
                    )
        }else{
            return null;
        }
    }

    renderInputField(){
        if(this.state.active && this.getTypeKindRecursively(this.props.model.type) !== TypeKind.INPUT_OBJECT){
            return <span >
                <input className={styles.input} onChange={this.handleChange}/>
            </span>
        }
    }

    handleChange = e => {
        let model = {[this.props.model.name]: e.target.value};
        if(this.props.root){
            model = {args: model}
        }
        this.props.receiver(model, this.props.index);
    }

    render() {
        if(this.props.listElem){
            return <InputParameterList model={this.props.model}
                                       typeDict={this.props.typeDict}
                                       receiver={this.receiveFromChild}
                                       name={this.props.name}
            />
        }else{
            const isListContainer = this.isListObject(this.props.model.type)

            return (<div className={styles.container} style={{marginLeft: '2em'}}>
                        <button onClick={this.handleClick} className={styles.button}>{this.state.active ? "-" : "+"}</button>
                        <span className={this.state.active ? styles.active : ''}>
                            {this.props.model.name}: {' '}
                        </span>
                        {this.renderInputField()}
                        {isListContainer && '['}
                        <span style={{marginLeft: '3px'}} className={styles.type}>
                            {this.getTypeNameRecursively(this.props.model.type)}
                        </span>
                        {isListContainer && ']'}
                        {this.props.model.type.kind === TypeKind.NON_NULL && <span className={styles.required}>!</span>}
                        {this.state.active && this.renderInputObjects()}
                    </div>);
        }
    }
}
