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
    }

    handleClick = e => {
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

    receiveFromChild = (model) =>{

    }

    isListObject(type){
        switch (type.kind) {
            case TypeKind.NON_NULL:
                return this.receiveFromChild(type.ofType)
            case TypeKind.LIST:
                return true;
            default:
                return false;
        }
    }

    getListElemTypeName(type){
        switch (type.kind) {
            case TypeKind.NON_NULL:
                return this.getListElemType(type.ofType)
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
                                   listElem={true}
            />

        }else if(this.getTypeKindRecursively(this.props.model.type) === TypeKind.INPUT_OBJECT){

            return this.props.typeDict[this.getTypeNameRecursively(this.props.model.type)].inputFields.map(field =>
                        <InputParameter key={field.name}
                                        model={field}
                                        typeDict={this.props.typeDict}
                                        receiver={this.receiveFromChild}
                        />
                    )
        }else{
            return null;
        }
    }

    renderInputField(){
        if(this.state.active && this.getTypeKindRecursively(this.props.model.type) !== TypeKind.INPUT_OBJECT){
            return <span >
                <input className={styles.input}/>
            </span>
        }
    }

    render() {

        if(this.props.listElem){
            return <InputParameterList model={this.props.model}
                                       typeDict={this.props.typeDict}
                                       receiver={this.receiveFromChild}
            />
        }else{
            console.log(this.props.model);
            return (<div className={styles.container} style={{marginLeft: '2em'}}>
                        <button onClick={this.handleClick} className={styles.button}>{this.state.active ? "-" : "+"}</button>
                        <span className={this.state.active ? styles.active : ''}>
                            {this.props.model.name}: {' '}
                        </span>
                        {this.renderInputField()}
                        <span style={{marginLeft: '3px'}} className={styles.type}>
                            {this.getTypeNameRecursively(this.props.model.type)}
                        </span>
                        {this.props.model.type.kind === TypeKind.NON_NULL && <span className={styles.required}>!</span>}
                        {this.state.active && this.renderInputObjects()}
                    </div>);
        }
    }
}
