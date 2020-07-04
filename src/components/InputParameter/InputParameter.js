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

        this.inputs = {args: {}}
    }

    handleClick = e => {
        this.props.clickHandler(this.props._key, this.props.index, this.state.active);

        if(this.state.active){
            this.props.receiver({
                fields: {},
                args: {
                    [this.props.model.name]: null
                }
            });
        }else{
            this.props.receiver({
                fields: {},
                args: {
                    [this.props.model.name]: this.getTypeKindRecursively(this.props.model.type) === TypeKind.INPUT_OBJECT ? {} : ""
                }
            });
        }

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
        this.inputs.fields = {...this.inputs.fields, ...model.fields};
        this.inputs.args = {...this.inputs.args, ...model.args};

        this.props.receiver({
            fields: {},
            args: {[this.props.model.name]: this.inputs}
        });
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
        this.props.receiver({
            fields: {},
            args: {
                [this.props.model.name]: e.target.value
            }
        });
    }

    render() {
        if(this.props.listElem){
            console.log(this.props.model);
            return <InputParameterList model={this.props.model}
                                       typeDict={this.props.typeDict}
                                       receiver={this.receiveFromChild}
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
